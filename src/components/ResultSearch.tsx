// src/components/ResultSearch.tsx
'use client';

import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { Search } from 'lucide-react';

type ResultsSearchProps = {
   onLoginSuccess?: (userId: string) => void;
};

export function ResultsSearch({ onLoginSuccess }: ResultsSearchProps) {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);

   const handleLogin = async (values: any) => {
      setLoading(true);
      try {
         const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               username: values.name, // 이름 필드
               password: values.password // 비밀번호 필드
            })
         });

         const json = await res.json();

         if (res.ok && json.success) {
            message.success(json.message ?? '로그인에 성공했습니다.');

            // 부모(Home)에게 로그인 성공 알려주기
            if (onLoginSuccess) {
               onLoginSuccess(json.userId as string);
            }

            // 폼 리셋
            form.resetFields();
         } else {
            const msg = json.message ?? '이름 또는 비밀번호가 올바르지 않습니다.';
            message.error(msg);
         }
      } catch (e) {
         console.error(e);
         message.error('로그인 중 오류가 발생했습니다.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full">
         <Form form={form} layout="vertical" onFinish={handleLogin} autoComplete="off" className="mb-6">
            <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
               <Input placeholder="이름을 입력하세요" size="large" />
            </Form.Item>

            <Form.Item
               label="비밀번호"
               name="password"
               rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
            >
               <Input.Password placeholder="비밀번호를 입력하세요" size="large" />
            </Form.Item>

            <Form.Item>
               <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full"
                  icon={<Search size={18} />}
               >
                  로그인
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
}
