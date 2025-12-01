import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
   title: '마니또 뽑기 - 크리스마스 마니또',
   description: '즐거운 크리스마스 마니또 게임'
};

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
      <html lang="ko">
         <body>
            <main className="min-h-screen  py-12 px-4 flex items-center justify-center">
               <div className="w-full max-w-2xl">
                  <div className=" text-center" style={{ marginBottom: '25px' }}>
                     <h1 style={{ fontSize: '2rem' }}>마니또 이벤트</h1>
                     <p className="text-gray-600">더존비앤에프의 서로의 SECRET 산타🎅가 되어보아요😚</p>
                  </div>
                  {children}
               </div>
            </main>
         </body>
      </html>
   );
}
