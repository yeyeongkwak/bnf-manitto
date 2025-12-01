export const sendVerifyEmail = async (email: string) => {
   console.log(email, 'email!!');
   return await fetch('/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
   });
};
