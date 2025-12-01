'use client';
import { Card, Col, Divider, Row } from 'antd';
import { Gift, User, UserPlus, Vote } from 'lucide-react';

export const SecretSantaSelection = () => {
   return (
      <Row gutter={[16, 16]}>
         <Col span={12}>
            <Card hoverable className={'custom-card'}>
               <div
                  style={{
                     height: '350px',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'column'
                  }}
               >
                  <Vote size={150} strokeWidth={1.2} />
                  <p style={{ textAlign: 'center' }}>계정이 이미 있으신가요?</p>
                  <br />
                  <p style={{ textAlign: 'center' }}>
                     아이디, 비밀번호로 입력 후
                     <br />
                     마니또 뽑기를 진행하실 수 있습니다!
                  </p>
               </div>
            </Card>
         </Col>
         <Col span={12}>
            <Card hoverable className={'custom-card'}>
               <div
                  style={{
                     height: '350px',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'column'
                  }}
               >
                  <UserPlus size={135} strokeWidth={1.2} />
                  <p style={{ textAlign: 'center', marginTop: '12px' }}>계정 만들기</p>
                  <br />
                  <p></p>
               </div>
            </Card>
         </Col>
      </Row>
   );
};
