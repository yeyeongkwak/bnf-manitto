// src/app/api/new-members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/superbaseClient';
import bcrypt from 'bcryptjs';

type Body = {
   email: string;
   username: string;
   password: string;
   message?: string | null;
   wantGift?: string | null;
   notWantGift?: string | null;
   profile_url?: string | null;
};

export async function POST(req: NextRequest) {
   try {
      const body = (await req.json()) as Body;

      if (!body || !body.username || !body.password) {
         return NextResponse.json({ error: 'username and password are required' }, { status: 400 });
      }

      // const email = body.email.trim().toLowerCase();
      const username = body.username.trim();
      const password = body.password;

      if (username.length < 3 || username.length > 3) {
         return NextResponse.json({ error: 'username must be 3' }, { status: 400 });
      }
      if (password.length < 6) {
         return NextResponse.json({ error: 'password must be at least 6 characters' }, { status: 400 });
      }

      // const emailRegex = /^[a-zA-Z0-9]+$/;
      // if (!emailRegex.test(email)) {
      //    return NextResponse.json({ error: 'invalid email' }, { status: 400 });
      // }

      const { data: existingUser, error: getUserErr } = await supabaseAdmin
         .from('users')
         .select('*')
         .eq('username', username)
         // .eq('email', email + '@douzone.com')
         .maybeSingle();

      if (getUserErr) {
         console.error('supabase get user err', getUserErr);
         return NextResponse.json({ error: 'internal' }, { status: 500 });
      }

      // 2) 아예 사전 등록(행) 자체가 없으면 → 본인 확인 안 된 케이스
      if (!existingUser) {
         return NextResponse.json({ error: 'User not found. Please request verification first.' }, { status: 404 });
      }

      // 3) 이미 password_hash가 채워져 있으면 → 이미 가입 완료된 사용자
      if (
         existingUser.password_hash && // null / undefined 아님
         typeof existingUser.password_hash === 'string' &&
         existingUser.password_hash.trim() !== ''
      ) {
         return NextResponse.json(
            {
               success: false,
               message: '이미 가입된 사용자입니다.',
               userId: existingUser.id
            },
            { status: 409 }
         );
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const updates: Record<string, any> = {
         username,
         password_hash: passwordHash,
         message: body.message ?? null,
         want_gift: body.wantGift ?? null,
         not_want_gift: body.notWantGift ?? null
      };

      const { error: updateErr } = await supabaseAdmin.from('users').update(updates).eq('id', existingUser.id);

      if (updateErr) {
         console.error('supabase update err', updateErr);
         if (updateErr.code === '23505') {
            return NextResponse.json({ error: 'Duplicate value' }, { status: 409 });
         }
         return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
      }

      return NextResponse.json(
         {
            success: true,
            message: 'User registered',
            userId: existingUser.id
         },
         { status: 200 }
      );
   } catch (err) {
      console.error('new-members error', err);
      return NextResponse.json({ error: 'internal server error' }, { status: 500 });
   }
}
