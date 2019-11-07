import React from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { OAuthButton } from 'components';

// your Cognito Hosted UI configuration
const oauth = {
  domain: 'azcdk.auth.us-east-1.amazoncognito.com',
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: 'https://localhost:3000/',
  redirectSignOut: 'https://localhost:3000/',
  responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
};

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_dCZGZU74z',
    userPoolWebClientId: '5cdculovevq2kqdhj5forn2288',
    // userPoolId: 'us-east-1_tl5SLxSyb',
    // userPoolWebClientId: '3skmgvtqjbv8a3lf6qbjav4af6',
  },
});

Auth.configure({ oauth });

interface IState {
  authState: string;
  authData: any;
  authError: any;
}

export class App extends React.Component<{}, IState> {
  state = {
    authState: 'loading',
    authData: null,
    authError: null,
  };

  constructor(props: any) {
    super(props);
    this.signOut = this.signOut.bind(this);

    // let the Hub module listen on Auth events
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          this.setState({ authState: 'signedIn', authData: data.payload.data });
          break;
        case 'signIn_failure':
          this.setState({ authState: 'signIn', authData: null, authError: data.payload.data });
          break;
        default:
          break;
      }
    });
  }

  componentDidMount() {
    console.log('on component mount');
    // check the current user when the App component is loaded
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log(user);
        this.setState({ authState: 'signedIn' });
      })
      .catch(e => {
        console.log(e);
        this.setState({ authState: 'signIn' });
      });
  }

  signOut() {
    Auth.signOut()
      .then(() => {
        this.setState({ authState: 'signIn' });
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { authState } = this.state;
    return (
      <div className="App">
        {authState === 'loading' && <div>loading...</div>}
        {authState === 'signIn' && <OAuthButton />}
        {authState === 'signedIn' && <button onClick={this.signOut}>Sign out</button>}
      </div>
    );
  }
}
