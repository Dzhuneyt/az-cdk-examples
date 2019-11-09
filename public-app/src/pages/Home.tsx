import React from 'react';
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { RouteComponentProps } from '@reach/router';

interface IHomeProps extends RouteComponentProps {}

export const Home: React.FC<IHomeProps> = () => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 500px;
        width: 100%;
        font-size: 150%;
        color: #343434;
        background-color: #bde0fc;
        p {
          margin: 100px 100px;
        }
      `}
    >
      <p>HOME</p>
    </div>
  );
};

// private async getAuthorizationHeader() {
// const session = await this.auth.currentSession();
// either id token or access token based on the API
// const idToken = session.getIdToken().getJwtToken();
// return {Authorization: idToken}
// }
