'use client';

import { Suspense, useEffect, useState } from 'react';
import { ResultsSearch } from '@/components/ResultSearch';
import { Button, Modal, Tabs } from 'antd';
import { RegistrationForm } from '@/components/MainForm';
import { SecretSanta } from '@/components/SecretSanta';

export default function Home() {
   const [activeTab, setActiveTab] = useState<string>('1');
   const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
   const [userId, setUserId] = useState<string | null>(null);

   const [showModal, setShowModal] = useState(false);

   const handleRegistrationComplete = (userId: string) => {
      setRegisteredUserId(userId);
      setShowModal(true);

      // 세션스토리지에 10분 만료 저장
      const expires = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem('user-uuid', JSON.stringify({ id: userId, expires }));
   };

   const handleModalConfirm = () => {
      setShowModal(false);
      setActiveTab('2'); // 마니또 뽑기 탭으로 이동
   };

   const handleModalCancel = () => {
      setShowModal(false);
      setRegisteredUserId(null);
      // RegistrationForm 내부에서 폼 리셋 함수 호출 가능
   };

   const handleLoginSuccess = (userId: string) => {
      // 세션 저장
      const expires = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem('user-uuid', JSON.stringify({ id: userId, expires }));

      // 상태 업데이트
      setUserId(userId);
      setActiveTab('2'); // 로그인 성공 → 마니또 탭으로 이동
   };

   const items = [
      {
         key: '1',
         label: '참가 신청',
         children: (
            <Suspense fallback={null}>
               <RegistrationForm onComplete={handleRegistrationComplete} />
            </Suspense>
         )
      },
      {
         key: '2',
         label: '마니또 뽑기 및 결과조회',
         children: <SecretSanta userId={userId} onRequireLogin={() => setActiveTab('3')} />
      },
      {
         key: '3',
         label: '로그인',
         children: <ResultsSearch onLoginSuccess={handleLoginSuccess} />
      }
   ];

   useEffect(() => {
      const stored = sessionStorage.getItem('user-uuid');
      if (!stored) return;

      try {
         const { id, expires } = JSON.parse(stored) as { id: string; expires?: number };

         if (!expires || Date.now() < expires) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserId(id);
         } else {
            sessionStorage.removeItem('user-uuid');
         }
      } catch {
         // 형식 깨진 경우 정리
         sessionStorage.removeItem('user-uuid');
      }
   }, []);

   return (
      <>
         <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            size="large"
            tabBarStyle={{
               display: 'flex',
               justifyContent: 'space-between'
            }}
         >
            {/* items prop으로 이미 탭이 렌더되므로 children은 필요 없음 */}
         </Tabs>
         <Modal
            maskClosable={false}
            open={showModal}
            onCancel={() => {
               handleModalCancel();
            }}
            footer={
               <div style={{ textAlign: 'center' }}>
                  <Button
                     onClick={() => {
                        handleModalCancel();
                     }}
                     style={{ marginRight: 8 }}
                  >
                     취 소
                  </Button>
                  <Button
                     type="primary"
                     onClick={() => {
                        handleModalConfirm();
                     }}
                  >
                     확 인
                  </Button>
               </div>
            }
            okText={'나의 마니또 뽑으러 가기👉🏻'}
            title={'본인인증 완료👏🏻'}
            style={{ textAlign: 'center' }}
         >
            본인인증 및 사용자 생성이 완료되었어요!
            <br />
            마니또를 뽑으러 가볼까요?!😁
         </Modal>
      </>
   );
}
