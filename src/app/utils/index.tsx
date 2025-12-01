import css from 'styled-jsx/css';

const statusStyles = {
   pending: css`
      background-color: #ffa500;
      color: #fff;
      border: none;

      &:hover {
         background-color: #ffb733;
         color: #fff;
      }
   `,
   verified: css`
      background-color: transparent;
      border: 2px solid #4caf50;
      color: #4caf50;

      &:hover {
         background-color: #81c784;
         color: #fff;
      }
   `,
   expired: css`
      background-color: transparent;
      border: 2px solid #ff4d4f;
      color: #ff4d4f;

      &:hover {
         background-color: #ff6b6b;
         color: #fff;
      }
   `
};
