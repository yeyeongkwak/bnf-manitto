'use client';

import { Form, Input, Button, Segmented, message, Modal } from 'antd';
import { AlertCircle, CheckCircle, Gift, Heart, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sendVerifyEmail } from '@/app/apis';
import { StyledButton } from '@/components/styled';
import { useSearchParams } from 'next/navigation';

type RegistrationFormProps = {
   onComplete?: (userId: string) => void;
};

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
   const [form] = Form.useForm();
   const [giftTab, setGiftTab] = useState<string>('want');
   const [verificationStatus, setVerificationStatus] = useState<'verified' | 'expired' | ''>('');
   const [loading, setLoading] = useState(false);
   const [gift, setGift] = useState({ wantGift: '', notWantGift: '' });
   const [moveSelectSecretSanta, setMoveSelectSecretSanta] = useState(true);

   const emailPrefix = form.getFieldValue('emailPrefix');
   const email = `${emailPrefix}@douzone.com`;
   const searchParams = useSearchParams();

   // 이메일 유효성 검사: 영문 대문자, 소문자, 특수문자, 숫자 조합 필요
   const validatePassword = (_: any, value: string) => {
      if (!value) {
         return Promise.resolve();
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

      if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
         return Promise.resolve();
      }

      return Promise.reject(new Error('영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.'));
   };

   // const handleSendVerifyEmail = async () => {
   //    try {
   //       setLoading(true);
   //       const values = await form.validateFields(['emailPrefix']);
   //       const prefix = values.emailPrefix;
   //       const res = await sendVerifyEmail(prefix + '@douzone.com');
   //       if (res) {
   //          message.success('인증 이메일이 발송되었습니다!');
   //       } else {
   //          message.error('인증 이메일 발송 중 오류가 발생했습니다.');
   //       }
   //    } catch (err) {
   //       const instance = form.getFieldInstance?.('emailPrefix');
   //       if (instance?.focus) instance.focus();
   //       else {
   //          const input = document.querySelector<HTMLInputElement>('input[placeholder^="이메일"]');
   //          input?.focus();
   //       }
   //       return;
   //    } finally {
   //       setLoading(false);
   //    }
   // };

   const handleSubmit = async (values: any) => {
      setLoading(true);
      try {
         const res = await fetch('/api/new-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               password: form.getFieldValue('password'),
               username: form.getFieldValue('name'),
               wantGift: gift.wantGift,
               notWantGift: gift.notWantGift
            })
         });

         let json = null;
         try {
            json = await res.json();
         } catch {
            // JSON 파싱 실패 시
            message.error('서버 응답을 해석할 수 없습니다.');
            return;
         }

         if (res.status === 200 && json?.success) {
            // ✅ 성공 케이스
            message.success('참가 신청이 완료되었습니다!');
            form.resetFields();
            setVerificationStatus('');
            setMoveSelectSecretSanta(true);

            const expires = Date.now() + 10 * 60 * 1000;
            sessionStorage.setItem('user-uuid', JSON.stringify({ id: json.userId, expires }));

            onComplete?.(json.userId);
         } else {
            // ❌ 실패 케이스 (409, 404, 400, 500 등 모두)
            const msg = json?.message ?? json?.error ?? '신청을 처리하는 중 오류가 발생했습니다.';
            message.error(msg);
            form.resetFields();
         }
      } catch (error) {
         console.error(error);
         message.error('신청 중 네트워크 오류가 발생했습니다.');
      } finally {
         setLoading(false);
      }
   };

   // useEffect(() => {
   //    const verified = searchParams.get('verified');
   //    const emailParam = searchParams.get('email');
   //
   //    if (verified === '1') {
   //       setVerificationStatus('verified');
   //
   //       if (emailParam) {
   //          // populate emailPrefix safely
   //          const prefix = emailParam.split('@')[0];
   //          form.setFieldsValue({ emailPrefix: prefix });
   //       }
   //
   //       // remove query from URL (optional) so page refresh won't re-trigger logic
   //       if (typeof window !== 'undefined') {
   //          const url = new URL(window.location.href);
   //          url.searchParams.delete('verified');
   //          url.searchParams.delete('email');
   //          window.history.replaceState({}, '', url.toString());
   //       }
   //
   //       return;
   //    }
   //
   //    // Optionally: if emailPrefix already present on mount, check status via API
   //    const prefixOnMount = form.getFieldValue('emailPrefix');
   //    if (prefixOnMount) {
   //       const emailToCheck = `${prefixOnMount}@douzone.com`;
   //       (async () => {
   //          try {
   //             const res = await fetch(`/api/check-email-verified?email=${encodeURIComponent(emailToCheck)}`);
   //             const data = await res.json();
   //             setVerificationStatus(data.status ?? (data.is_email_verified ? 'verified' : 'pending'));
   //          } catch {
   //             setVerificationStatus('');
   //          }
   //       })();
   //    }
   // }, []); // eslint-disable-line react-hooks/exhaustive-deps

   return (
      <>
         <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" className="w-full">
            {/* 이름 필드 */}
            <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
               <Input placeholder="이름을 입력하세요" size="large" maxLength={3} minLength={3} />
            </Form.Item>

            {/* 비밀번호 필드 */}
            <Form.Item
               label="비밀번호"
               name="password"
               rules={[
                  { required: true, message: '비밀번호를 입력해주세요.' },
                  { min: 6, message: '비밀번호는 6자 이상이어야 합니다.' },
                  {
                     validator: validatePassword
                  }
               ]}
            >
               <Input.Password placeholder="비밀번호를 입력하세요" size="large" />
            </Form.Item>

            {/* 이메일 필드 */}
            {/*<Form.Item label="이메일" required className="mb-4">*/}
            {/*   <div className="flex gap-2 items-center">*/}
            {/*      <Form.Item*/}
            {/*         name="emailPrefix"*/}
            {/*         noStyle*/}
            {/*         rules={[*/}
            {/*            { required: true, message: '이메일을 입력해주세요.' },*/}
            {/*            {*/}
            {/*               pattern: /^[a-zA-Z0-9]+$/,*/}
            {/*               message: '영문과 숫자만 입력 가능합니다.'*/}
            {/*            }*/}
            {/*         ]}*/}
            {/*      >*/}
            {/*         <Input*/}
            {/*            placeholder="이메일 (예: user@)"*/}
            {/*            size="large"*/}
            {/*            name={'email'}*/}
            {/*            disabled={verificationStatus === 'verified'}*/}
            {/*            style={{ maxWidth: '300px' }}*/}
            {/*            onChange={e => {*/}
            {/*               const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');*/}
            {/*               form.setFieldValue('emailPrefix', value); // 실제 form 상태 업데이트*/}
            {/*            }}*/}
            {/*         />*/}
            {/*      </Form.Item>*/}
            {/*      @*/}
            {/*      <Input disabled={true} placeholder={'douzone.com'} size={'large'} />*/}
            {/*      <StyledButton*/}
            {/*         size={'large'}*/}
            {/*         style={{ padding: 20 }}*/}
            {/*         status={verificationStatus}*/}
            {/*         onClick={() => verificationStatus !== 'verified' && handleSendVerifyEmail()}*/}
            {/*         icon={*/}
            {/*            verificationStatus === 'verified' ? (*/}
            {/*               <CheckCircle style={{ display: 'flex', justifyContent: 'center' }} />*/}
            {/*            ) : verificationStatus === 'expired' ? (*/}
            {/*               <AlertCircle style={{ display: 'flex', justifyContent: 'center' }} />*/}
            {/*            ) : (*/}
            {/*               <Mail style={{ display: 'flex', justifyContent: 'center' }} />*/}
            {/*            )*/}
            {/*         }*/}
            {/*      />*/}
            {/*   </div>*/}
            {/*</Form.Item>*/}

            {/* 마니또에게 한 마디 */}
            <Form.Item
               label={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                     <Heart size={16} color="#FF937E" />
                     마니또에게 한 마디 (선택)
                  </span>
               }
               name="message"
            >
               <Input.TextArea
                  placeholder="마니또에게 해주고 싶은 말이 있다면 입력해주세요~!~! (생략 가능)"
                  rows={3}
                  size={'large'}
                  maxLength={200}
                  showCount
               />
            </Form.Item>

            {/* 받고 싶은 선물 / 받고 싶지 않은 선물 탭 */}
            <Form.Item
               name={'giftList'}
               label={
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                     <Gift size={16} color="#FF937E" />
                     마니또에게 선물을 알려주세요! (선택)
                  </span>
               }
            >
               <Segmented
                  value={giftTab}
                  size={'large'}
                  onChange={value => setGiftTab(value as string)}
                  options={[
                     { label: '받고 싶은 선물', value: 'want' },
                     { label: '받고 싶지 않은 선물', value: 'dontwant' }
                  ]}
                  block
                  className="w-full"
               />
            </Form.Item>

            {/* 선물 선호도별 입력 필드 */}
            {giftTab === 'want' ? (
               <Input.TextArea
                  placeholder="받고 싶은 선물을 입력하세요 (예: 책, 커피, 향초 등)"
                  rows={3}
                  maxLength={300}
                  showCount
                  value={gift.wantGift}
                  onChange={e => setGift({ ...gift, wantGift: e.target.value })}
                  size={'large'}
                  style={{ marginBottom: '2rem' }}
               />
            ) : (
               <Input.TextArea
                  placeholder="받고 싶지 않은 선물을 입력하세요 (예: 디퓨저, 꽃 등)"
                  rows={3}
                  value={gift.notWantGift}
                  onChange={e => setGift({ ...gift, notWantGift: e.target.value })}
                  maxLength={300}
                  size={'large'}
                  showCount
                  style={{ marginBottom: '2rem' }}
               />
            )}

            {/* 제출 버튼 */}
            <Form.Item>
               <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full">
                  참가 신청하기
               </Button>
            </Form.Item>
         </Form>
      </>
   );
}
