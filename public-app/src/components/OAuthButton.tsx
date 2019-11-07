import React from 'react';
import { withOAuth } from 'aws-amplify-react';

interface IProps {
  OAuthSignIn: () => void;
}

const OAuthButtonComp: React.FC<IProps> = ({ OAuthSignIn }) => {
  return <button onClick={OAuthSignIn}>Sign in with AWS</button>;
};

export const OAuthButton = withOAuth(OAuthButtonComp);
