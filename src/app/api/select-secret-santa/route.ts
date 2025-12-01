import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/superbaseClient';

type DrawSantaBody = { userId: string };

export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      const body = (await req.json()) as DrawSantaBody;

      if (!body?.userId) {
         return NextResponse.json({ error: 'userId가 없습니다.' }, { status: 400 });
      }

      const { data, error } = await supabaseAdmin.rpc('draw_secret_santa', {
         p_user_id: body.userId
      });

      if (error) {
         return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (!data || data.length === 0) {
         return NextResponse.json({ error: '매칭 결과가 없습니다.' }, { status: 500 });
      }

      const row = data[0];

      const response = {
         isNew: row.is_new_match,
         giver: {
            id: row.giver_id,
            username: row.giver_username,
            profileUrl: row.giver_profile_url
         },
         receiver: {
            id: row.receiver_id,
            username: row.receiver_username,
            profileUrl: row.receiver_profile_url,
            email: row.receiver_email,
            message: row.receiver_message,
            wantGift: row.receiver_want_gift,
            notWantGift: row.receiver_not_want_gift
         }
      };

      return NextResponse.json(response, { status: 200 });
   } catch (e) {
      console.error(e);
      return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
   }
}
