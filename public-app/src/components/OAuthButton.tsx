import React from 'react';
import { withOAuth } from 'aws-amplify-react';

interface IProps {
  OAuthSignIn: () => void;
  // facebookSignIn: () => void;
}

const OAuthButtonComp: React.FC<IProps> = ({ OAuthSignIn }) => {
  return <button onClick={OAuthSignIn}>Sign in with AWS</button>;
  // return <button onClick={facebookSignIn}>Sign in with FACEBOOK</button>;
};

export const OAuthButton = withOAuth(OAuthButtonComp);
