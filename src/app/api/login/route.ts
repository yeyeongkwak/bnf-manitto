// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/superbaseClient';
import bcrypt from 'bcryptjs';

type Body = {
   username?: string;
   password?: string;
};

export async function POST(req: NextRequest) {
   try {
      const body = (await req.json()) as Body;
      const username = body.username?.trim();
      const password = body.password ?? '';

      if (!username || !password) {
         return NextResponse.json({ success: false, message: '이름과 비밀번호를 입력해주세요.' }, { status: 400 });
      }

      // 1) username 으로 유저 조회
      const { data: user, error } = await supabaseAdmin
         .from('users')
         .select('id, username, password_hash')
         .eq('username', username)
         .maybeSingle();

      if (error) {
         console.error('supabase login error', error);
         return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
      }

      if (!user || !user.password_hash) {
         // 사용자 없음 or 아직 비번 안 세팅된 row
         return NextResponse.json(
            { success: false, message: '이름 또는 비밀번호가 올바르지 않습니다. 가입 이력을 함께 확인해주세요.' },
            { status: 401 }
         );
      }

      // 2) 비밀번호 검증
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
         return NextResponse.json(
            { success: false, message: '이름 또는 비밀번호가 올바르지 않습니다.' },
            { status: 401 }
         );
      }

      // 3) 로그인 성공
      return NextResponse.json(
         {
            success: true,
            message: '로그인에 성공했습니다.',
            userId: user.id,
            username: user.username
         },
         { status: 200 }
      );
   } catch (err) {
      console.error('login error', err);
      return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
   }
}
