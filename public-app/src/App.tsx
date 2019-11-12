import React, { useState, useEffect } from 'react';
import { Router, Link } from '@reach/router';
import { GateKeeper, MainMenu, init, gate } from 'gate';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { Dashboard, Home, NotFound } from './pages';

init(
  process.env.REACT_APP_USER_POOL_ID || '',
  process.env.REACT_APP_USER_POOL_CLIENT_ID || '',
  'azcdk-xyz.auth.us-east-1.amazoncognito.com',
  'https://localhost:3000/',
  'https://localhost:3000/',
);

const entries = [
  <Link key="link-to-dashboard" to="/dashboard">
    <span>DASHBOARD</span>
  </Link>,
];

export const App: React.FC = () => {
  const [access, setAccess] = useState(false);

  useEffect(() => {
    setAccess(gate.access());
    return gate.subscribe(() => {
      console.log(gate.state.user);
      setAccess(gate.access());
    }, 'az-cdk-examples-App');
  }, []);

  return (
    <React.Fragment>
      <GateKeeper />
      <MainMenu
        NarrowLogoIcon={IconHouseThreeD}
        WideLogoIcon={IconHouseThreeD}
        wideLogoWidth={60}
        narrowMiddleEntries={entries}
        wideMiddleEntries={entries}
      />
      {access && (
        <Router>
          <Home path="/" />
          <Dashboard path="/dashboard" />
          <NotFound default />
        </Router>
      )}
    </React.Fragment>
  );
};
