'use client';

import { useState } from 'react';
import { Button, Modal } from 'antd';
import { GiftOutlined } from '@ant-design/icons';

interface SecretSantaResult {
   name: string;
   email: string;
   message: string;
   wishList: string;
   unwishList: string;
}

const SecretSantaPage = () => {
   const [isFlipped, setIsFlipped] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [result, setResult] = useState<SecretSantaResult | null>(null);

   const handleDrawSecretSanta = async () => {
      setIsLoading(true);
      setIsFlipped(false);

      try {
         await new Promise(resolve => setTimeout(resolve, 1500));

         const sampleResults: SecretSantaResult[] = [
            {
               name: '김철수',
               email: 'kim@douzone.com',
               message: '항상 응원합니다!',
               wishList: '커피, 책, 손목시계',
               unwishList: '향수, 양말'
            },
            {
               name: '이영희',
               email: 'lee@douzone.com',
               message: '화이팅!',
               wishList: '초콜릿, 캔들, 에코백',
               unwishList: '귀금속, 옷'
            },
            {
               name: '박민수',
               email: 'park@douzone.com',
               message: '감사합니다!',
               wishList: '게임, 피규어, 헤드폰',
               unwishList: '화장품, 스킨케어'
            }
         ];

         const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)];
         setResult(randomResult);
         setIsFlipped(true);
      } catch (error) {
         console.error('마니또 뽑기 실패:', error);
         Modal.error({
            title: '오류',
            content: '마니또 뽑기에 실패했습니다. 다시 시도해주세요.'
         });
      } finally {
         setIsLoading(false);
      }
   };

   // const handleReset = () => {
   //   setResult(null)
   //   setIsFlipped(false)
   //   setTimeout(() => {
   //     handleDrawSecretSanta()
   //   }, 300)
   // }

   return (
      <div className="flex flex-col items-center justify-center min-h-96 py-12">
         {!result ? (
            <div className="flex flex-col items-center gap-8">
               <div className="text-center">
                  <GiftOutlined className="text-6xl text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">마니또를 뽑아보세요!</h2>
                  <p className="text-gray-600">아래 버튼을 클릭하면 당신의 마니또가 나타납니다.</p>
               </div>

               <Button
                  type="primary"
                  size="large"
                  onClick={handleDrawSecretSanta}
                  loading={isLoading}
                  className="w-full max-w-xs"
               >
                  {isLoading ? '마니또 뽑는 중...' : '마니또 뽑기'}
               </Button>
            </div>
         ) : (
            <div className="w-full max-w-md">
               <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                  <div className="flip-card-inner">
                     {/* 앞면 */}
                     <div className="flip-card-front">
                        <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg shadow-xl p-8">
                           <GiftOutlined className="text-8xl text-white mb-4" />
                           <p className="text-white text-xl font-bold text-center">클릭해서 뒤집기!</p>
                        </div>
                     </div>

                     {/* 뒷면 */}
                     <div className="flip-card-back">
                        <div className="h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-xl p-8 flex flex-col justify-center text-white overflow-y-auto">
                           <h3 className="text-3xl font-bold mb-6 text-center">나의 마니또</h3>

                           <div className="space-y-4">
                              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                 <p className="text-sm opacity-80">이름</p>
                                 <p className="text-2xl font-bold">{result.name}</p>
                              </div>

                              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                 <p className="text-sm opacity-80">메시지</p>
                                 <p className="text-lg">{result.message}</p>
                              </div>

                              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                 <p className="text-sm opacity-80">받고 싶은 선물</p>
                                 <p className="text-lg">{result.wishList}</p>
                              </div>

                              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                                 <p className="text-sm opacity-80">받고 싶지 않은 선물</p>
                                 <p className="text-lg">{result.unwishList}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 카드 뒤집기 버튼만 남김 */}
               <Button type="default" size="large" onClick={() => setIsFlipped(!isFlipped)} className="w-full mt-6">
                  {isFlipped ? '앞면 보기' : '뒷면 보기'}
               </Button>
            </div>
         )}
      </div>
   );
};
export default SecretSantaPage;
