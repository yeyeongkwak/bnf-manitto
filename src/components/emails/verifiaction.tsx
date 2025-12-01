import { Body, Button, Container, Head, Hr, Html, Preview, Row, Section, Text } from '@react-email/components';

interface ManitoVerificationEmailProps {
   verificationUrl: string;
}

export default function ManitoVerificationEmail({ verificationUrl }: ManitoVerificationEmailProps) {
   return (
      <Html>
         <Head />
         <Preview>마니또 이벤트 메일 인증 링크입니다.</Preview>
         <Body style={main}>
            <Container style={container}>
               <Section style={box}>
                  <Row>
                     <Text style={heading}> 마니또 이벤트 메일 인증 링크입니다.</Text>
                  </Row>

                  <Hr style={hr} />

                  <Text style={paragraph}>안녕하세요! 마니또 이벤트 참여를 위해 이메일 인증이 필요합니다.</Text>

                  <Text style={paragraph}>아래 버튼을 눌러 인증을 완료해주세요.</Text>

                  <Section style={buttonContainer}>
                     <Button style={button} href={verificationUrl}>
                        인증하기
                     </Button>
                  </Section>

                  <Hr style={hr} />

                  <Text style={footer}>이 메일은 발신 전송입니다.</Text>
               </Section>
            </Container>
         </Body>
      </Html>
   );
}

const main = {
   backgroundColor: '#f8f4f1',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};

const container = {
   backgroundColor: '#ffffff',
   borderRadius: '10px',
   margin: '64px',
   padding: '40px 0 48px'
};

const box = {
   padding: '0 48px'
};

const heading = {
   fontSize: '32px',
   fontWeight: 'bold',
   margin: '16px 0',
   paddingTop: '10px',
   textAlign: 'center' as const,
   color: '#1f2937'
};

const paragraph = {
   color: '#525f7f',
   fontSize: '16px',
   lineHeight: '24px',
   textAlign: 'center' as const,
   margin: '16px 0'
};

const hr = {
   borderColor: '#e5e7eb',
   margin: '26px 0'
};

const buttonContainer = {
   textAlign: 'center' as const,
   margin: '26px 0'
};

const button = {
   backgroundColor: '#ef4444',
   borderRadius: '8px',
   color: '#fff',
   fontSize: '16px',
   fontWeight: 'bold',
   textDecoration: 'none',
   textAlign: 'center' as const,
   display: 'block',
   padding: '12px 32px',
   margin: '0 auto',
   width: 'fit-content'
};

const footer = {
   color: '#8898aa',
   fontSize: '12px',
   lineHeight: '16px',
   textAlign: 'center' as const,
   margin: '12px 0'
};
