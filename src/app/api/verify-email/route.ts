import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/superbaseClient';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export async function GET(req: NextRequest) {
   const token = req.nextUrl.searchParams.get('token');

   const { data: record } = await supabaseAdmin
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .maybeSingle();

   if (!record) {
      // 실패하면 프론트의 실패 페이지로 리다이렉트하거나 JSON 반환
      // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?verified=0`);
   }

   const expiresUTC = dayjs.utc(record.expires_at).valueOf();
   const nowUTC = dayjs.utc().valueOf();

   // if (record.used || expiresUTC < nowUTC) {
   if (expiresUTC < nowUTC) {
      // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?verified=0`);
   }

   await supabaseAdmin.from('email_verifications').update({ used: true }).eq('id', record.id);

   const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, is_email_verified')
      .eq('id', record.user_id)
      .single();

   const redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!);
   redirectUrl.searchParams.set('verified', '1');

   if (user?.email) redirectUrl.searchParams.set('email', user.email);

   return NextResponse.redirect(redirectUrl.toString());
}
