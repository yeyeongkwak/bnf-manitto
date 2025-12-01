import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuid } from 'uuid';
import { supabaseAdmin } from '@/lib/superbaseClient';
import ManitoVerificationEmail from '@/components/emails/verifiaction';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
   const { email } = await req.json();

   const { data: user } = await supabaseAdmin.from('users').select('*').eq('email', email).maybeSingle();

   if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

   const token = uuid();
   const expiresAtUTC = new Date(Date.now() + 10 * 60 * 1000).toISOString();

   const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

   await supabaseAdmin.from('email_verifications').insert({
      user_id: user.id,
      token,
      expires_at: expiresAtUTC
   });

   try {
      await resend.emails.send({
         from: process.env.FROM_EMAIL!,
         to: email,
         subject: '마니또 이벤트 이메일 인증',
         react: ManitoVerificationEmail({
            verificationUrl
         })
      });
      return NextResponse.json({ message: 'Verification email sent' });
   } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
   }
}
