import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { Handshake } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;
type Profile = {
   id: string;
   username: string | null;
   profileUrl: string | null;
};

type SecretSantaResult = {
   giver: Profile;
   receiver: Profile & {
      email: string | null;
      message: string | null;
      wantGift: string | null;
      notWantGift: string | null;
   };
   isNew: boolean;
};

export const SecretSanta = (props: { userId: string | null; onRequireLogin: () => void }) => {
   const { userId, onRequireLogin } = props;
   const [result, setResult] = useState<SecretSantaResult | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [showDetails, setShowDetails] = useState(false);
   const [effectiveUserId, setEffectiveUserId] = useState<string | null>(userId);
   const handleDraw = async () => {
      if (!userId) {
         // 화면에서 에러 텍스트보다, 바로 로그인 탭으로 보내버리기
         setError(null);
         onRequireLogin();
         return;
      }

      setLoading(true);
      setError(null);

      const res = await fetch('/api/select-secret-santa', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ userId })
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
         setError(json.error ?? '알 수 없는 에러가 발생했습니다.');
         return;
      }

      setResult(json as SecretSantaResult);
   };

   const renderAvatar = (profile: Profile, clickable = false) => {
      const initial = profile.username?.[0]?.toUpperCase() ?? '?';

      return (
         <Avatar
            size={72}
            src={profile.profileUrl || undefined}
            style={{
               backgroundColor: profile.profileUrl ? undefined : '#ffd6e7',
               cursor: clickable ? 'pointer' : 'default',
               boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
            }}
            onClick={clickable ? () => setShowDetails(v => !v) : undefined}
         >
            {!profile.profileUrl && <span style={{ fontSize: 28, fontWeight: 700, color: '#cf1322' }}>{initial}</span>}
         </Avatar>
      );
   };

   useEffect(() => {
      // 부모가 userId를 이미 내려줬으면 그걸 우선 사용
      if (userId) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setEffectiveUserId(userId);
         return;
      }

      // 부모에서 안 내려준 경우, sessionStorage에서 직접 읽기
      try {
         const stored = sessionStorage.getItem('user-uuid');
         if (!stored) {
            setEffectiveUserId(null);
            return;
         }

         const { id, expires } = JSON.parse(stored) as { id: string; expires?: number };

         if (!expires || Date.now() < expires) {
            setEffectiveUserId(id);
         } else {
            sessionStorage.removeItem('user-uuid');
            setEffectiveUserId(null);
         }
      } catch {
         sessionStorage.removeItem('user-uuid');
         setEffectiveUserId(null);
      }
   }, [userId]);

   return (
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
         {/* draw button */}
         {!result && (
            <div
               style={{
                  textAlign: 'center',
                  minHeight: '100px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
               }}
            >
               {!userId && (
                  <Button
                     onClick={() => onRequireLogin()}
                     className="px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     로그인으로 이동!
                  </Button>
               )}
               {userId && (
                  <Button
                     onClick={handleDraw}
                     disabled={loading || !userId}
                     className="px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold shadow-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {loading ? '마니또 뽑는 중...' : '나의 마니또 뽑기 / 조회하기'}
                  </Button>
               )}
            </div>
         )}

         {error && (
            <Text type="danger" style={{ display: 'block', textAlign: 'center' }}>
               {error}
            </Text>
         )}

         {result && !result.isNew && (
            <Alert
               type="info"
               showIcon
               message="이미 매칭된 마니또가 있어요!"
               description="이전에 뽑은 결과를 다시 보여줍니다."
               style={{ marginTop: 16, marginBottom: '-60px' }}
            />
         )}

         {result && (
            <div
               style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12, // Alert, main card, memo card 사이 간격
                  marginTop: 16
               }}
            >
               {/* 메인 매칭 카드 */}
               <div
                  style={{
                     minHeight: 260,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center'
                  }}
               >
                  <Card
                     bordered={false}
                     style={{
                        borderRadius: 28,
                        boxShadow: '0 14px 40px rgba(15, 23, 42, 0.12)',
                        padding: '18px 28px'
                     }}
                     bodyStyle={{ padding: 0 }}
                  >
                     <Row align="middle" justify="space-between" gutter={48}>
                        {/* me */}
                        <Col flex="0 0 160px" style={{ textAlign: 'center' }}>
                           <Space direction="vertical" align="center" size={8}>
                              {renderAvatar(result.giver)}
                              <Text strong>{result.giver.username ?? '나'}</Text>
                           </Space>
                        </Col>

                        {/* centre text */}
                        <Col flex="auto" style={{ textAlign: 'center' }}>
                           <Space direction="vertical" align="center" size={8}>
                              <div
                                 style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: '999px',
                                    background: '#ff4d4f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 12px 30px rgba(255,77,79,0.45)'
                                 }}
                              >
                                 <Handshake style={{ color: '#fff', fontSize: 28 }} />
                              </div>

                              <Text strong style={{ color: '#d4380d', fontSize: 14 }}>
                                 SECRET SANTA MATCHED!
                              </Text>
                              <Text style={{ fontSize: 13 }}>두 사람이 올 크리스마스의 비밀 친구가 되었어요 🎄</Text>
                              <Tag color="red" style={{ marginTop: 4 }}>
                                 상대 프로필을 눌러 메모 보기
                              </Tag>
                           </Space>
                        </Col>

                        {/* friend */}
                        <Col flex="0 0 160px" style={{ textAlign: 'center' }}>
                           <Space direction="vertical" align="center" size={8}>
                              {renderAvatar(result.receiver, true)}
                              <Text strong>{result.receiver.username ?? '마니또'}</Text>
                           </Space>
                        </Col>
                     </Row>
                  </Card>
               </div>

               {/* 메모 카드 */}
               {showDetails && (
                  <Card
                     size="small"
                     style={{
                        borderRadius: 20,
                        padding: 2,
                        background: '#fff',
                        boxShadow: '0 10px 25px rgba(15,23,42,0.08)'
                     }}
                  >
                     <Space direction="vertical" style={{ width: '100%' }} size={4}>
                        <Title level={5} style={{ marginBottom: 4 }}>
                           {(result.receiver.username ?? '마니또') + '님이 남긴 메모'}
                        </Title>

                        {result.receiver.message && (
                           <Paragraph style={{ marginBottom: 4 }}>
                              <Text strong>한마디 · </Text>
                              {result.receiver.message}
                           </Paragraph>
                        )}

                        {result.receiver.wantGift && (
                           <Paragraph style={{ marginBottom: 4 }}>
                              <Text strong>받고 싶은 선물 · </Text>
                              {result.receiver.wantGift}
                           </Paragraph>
                        )}

                        {result.receiver.notWantGift && (
                           <Paragraph style={{ marginBottom: 0 }}>
                              <Text strong>피하고 싶은 선물 · </Text>
                              {result.receiver.notWantGift}
                           </Paragraph>
                        )}

                        {!result.receiver.message && !result.receiver.wantGift && !result.receiver.notWantGift && (
                           <Text type="secondary">아직 메모가 없습니다. 직접 물어볼 수는 없어요, 비밀이니까요 😉</Text>
                        )}
                     </Space>
                  </Card>
               )}
            </div>
         )}
      </Space>
   );
};
