'use client';

import { Form, Input, Button, message, Empty, Card } from 'antd';
import { useState } from 'react';
import { Lock, Search } from 'lucide-react';

type ResultsSearchProps = {
   onLoginSuccess?: (userId: string) => void;
};

export function ResultsSearch({ onLoginSuccess }: ResultsSearchProps) {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const [results, setResults] = useState<any>(null);

   const handleSearch = async (values: any) => {
      setLoading(true);
      try {
         // 여기에 실제 API 호출 로직을 추가
         console.log('검색:', values);

         // 더미 데이터 예제
         setResults({
            name: values.name,
            email: values.email,
            manito: '홍길동',
            manitoMessage: '반갑습니다!',
            yourMessage: '감사합니다!'
         });

         message.success('결과를 조회했습니다.');
      } catch (error) {
         message.error('조회 중 오류가 발생했습니다.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full">
         <Form form={form} layout="vertical" onFinish={handleSearch} autoComplete="off" className="mb-6">
            <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
               <Input placeholder="이름을 입력하세요" size="large" />
            </Form.Item>

            <Form.Item
               label={'비밀번호'}
               name={'password'}
               rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
            >
               <Input size={'large'} placeholder={'비밀번호를 입력하세요'} />
            </Form.Item>

            <Form.Item>
               <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full"
                  icon={<Lock size={18} />}
               >
                  로그인
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
}
