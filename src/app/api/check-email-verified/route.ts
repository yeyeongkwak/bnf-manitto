import { supabaseAdmin } from '@/lib/superbaseClient';
import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export async function GET(req: NextRequest) {
   const email = req.nextUrl.searchParams.get('email');
   if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

   // 사용자 정보 + 최근 토큰 확인
   const { data: user } = await supabaseAdmin.from('users').select('*').eq('email', email).single();

   if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

   // 마지막 토큰 가져오기
   const { data: tokenData } = await supabaseAdmin
      .from('email_verifications')
      .select('token, expires_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

   let status: 'verified' | 'expired' | '' = '';

   // if (user.is_email_verified) {
   //    status = 'verified';
   // } else if (tokenData) {
   if (tokenData) {
      const expiresUTC = dayjs.utc(tokenData.expires_at).valueOf();
      const nowUTC = dayjs.utc().valueOf();
      if (expiresUTC < nowUTC) {
         status = 'expired';
      } else {
         status = 'verified';
      }
   }

   return NextResponse.json({
      status
   });
}
