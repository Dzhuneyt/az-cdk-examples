import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
// tslint:disable-next-line: align
/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import { TopMenu, Button } from 'rcomps';
import { useUser } from 'hooks';
import { Spinner } from './Spinner';

const color = '#a29bfe';

export const Header: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const user = useUser();

  return (
    <div
      css={css`
        background-color: ${color};
      `}
    >
      <TopMenu
        entries={[
          <div key="logo">{user.loggedIn ? `[${user.email}]` : 'az-cdk-examples'}</div>,
          <Button
            key="logout"
            onClick={async () => {
              setShowSpinner(true);
              await Auth.signOut();
              setShowSpinner(false);
            }}
          >
            <div
              css={css`
                width: 64px;
              `}
            >
              {showSpinner ? (
                <Spinner color={color} size={5} margin={0} />
              ) : (
                <div>{user.loggedIn ? 'LOGOUT' : 'LOGIN'}</div>
              )}
            </div>
          </Button>,
        ]}
      />
    </div>
  );
};
