import React from 'react';
import { Router } from '@reach/router';
import Amplify from '@aws-amplify/core';
import { I18n } from 'aws-amplify';
import { Authenticator, Greetings, AmplifyTheme } from 'aws-amplify-react';
import { UsernameAttributes } from 'aws-amplify-react/lib-esm/Auth/common/types';
import { Header } from 'components';
import { Dashboard, Home, NotFound } from './pages';
import { useUser } from 'hooks';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_tl5SLxSyb',
    userPoolWebClientId: '3skmgvtqjbv8a3lf6qbjav4af6',
  },
});

I18n.putVocabularies({
  pt: {
    'Sign In': 'Entrar',
    'Sign in': 'Entrar',
    'Sign Up': 'Criar conta',
    'Sign in to your account': 'Fazer o login',
    'Forget your password?': 'Esqueceu sua senha?',
    'No account?': 'Sem conta?',
    'Have an account?': 'Já tem conta?',
    'Create account': 'Criar conta',
    'Username *': 'Email',
    'Password *': 'Senha',
  },
});

I18n.setLanguage('pt');

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#ebebeb',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '10px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#a29bfe',
  },
};

const signUpConfig = {
  header: 'Criar conta',
  hiddenDefaults: ['phone_number'],
};

// const TheApp: React.FC = () => {
export const App: React.FC = () => {
  const user = useUser();

  return (
    <React.Fragment>
      <Header />
      <Authenticator
        hide={[Greetings]}
        theme={theme}
        signUpConfig={signUpConfig}
        usernameAttributes={UsernameAttributes.EMAIL}
      />
      {user.loggedIn && (
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <NotFound default />
        </Router>
      )}
    </React.Fragment>
  );
};
