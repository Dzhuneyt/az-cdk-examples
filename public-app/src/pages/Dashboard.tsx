import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { RouteComponentProps } from '@reach/router';

interface IDashboardProps extends RouteComponentProps {}

export const Dashboard: React.FC<IDashboardProps> = () => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 500px;
        width: 100%;
        font-size: 150%;
        color: white;
        background-color: #0984e3;
        p {
          margin: 100px 100px;
        }
      `}
    >
      <p>DASHBOARD</p>
    </div>
  );
};
