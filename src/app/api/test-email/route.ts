import { Resend } from 'resend';
import ManitoVerificationEmail from '@/components/emails/verifiaction';
import { v4 as uuid } from 'uuid';

const resend = new Resend(process.env.RESEND_API_KEY!);
const verificationToken = uuid();
const verificationUrl = `http://localhost:3000/verify?token=${verificationToken}`;
export async function GET() {
   try {
      const data = await resend.emails.send({
         from: process.env.FROM_EMAIL!, // 본인의 이메일로 수정
         to: 'aesop0817@douzone.com',
         subject: '🎁 마니또 이벤트 이메일 인증',
         react: ManitoVerificationEmail({
            verificationUrl
         })
      });
      return Response.json(data);
   } catch (error) {
      return Response.json({ error }, { status: 400 });
   }
}
