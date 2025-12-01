import styled from '@emotion/styled';
import { Button } from 'antd';
type VerificationStatus = 'pending' | 'verified' | 'expired' | '';
export const StyledButton = styled(Button)<{ status: VerificationStatus }>`
   font-weight: 500;
   /* 기본 상태 */
   background-color: #fff;
   color: rgba(0, 0, 0, 60%);
   border: 1px solid #d9d9d9;

   &:hover {
      background-color: #e6e6e6;
      color: #000;
   }

   ${({ status }) =>
      status === 'pending' &&
      `
      background-color: #ffa500;
      color: #fff;
      border: none;

      &:hover {
        background-color: #ffb733;
        color: #fff;
      }
    `}

   ${({ status }) =>
      status === 'verified' &&
      `
      background-color: transparent;
      border: 2px solid #4caf50;
      color: #4caf50;

      &:hover {
        background-color: #81c784;
        color: #fff;
      }
    `}

  ${({ status }) =>
      status === 'expired' &&
      `
      background-color: transparent;
      border: 2px solid #ff4d4f;
      color: #ff4d4f;

      &:hover {
        background-color: #ff6b6b;
        color: #fff;
      }
    `}
`;
