import React, { useState, useEffect } from 'react';
import { Router, Link } from '@reach/router';
import { GateKeeper, MainMenu } from 'gate';
import { IconHouseThreeD } from '@cpmech/react-icons';
import { Dashboard, Home, NotFound } from './pages';
import { gate } from 'store';

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
      if (gate.access()) {
        console.log('got access: you may init store here');
      }
      setAccess(gate.access());
    }, 'az-cdk-examples-App');
  }, []);

  return (
    <div>
      <GateKeeper gate={gate} />
      {access && (
        <React.Fragment>
          <MainMenu
            gate={gate}
            NarrowLogoIcon={IconHouseThreeD}
            WideLogoIcon={IconHouseThreeD}
            wideLogoWidth={60}
            narrowMiddleEntries={entries}
            wideMiddleEntries={entries}
          />
          <Router>
            <Home path="/" />
            <Dashboard path="/dashboard" />
            <NotFound default />
          </Router>
        </React.Fragment>
      )}
    </div>
  );
};
