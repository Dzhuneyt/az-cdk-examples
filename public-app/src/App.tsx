import React from 'react';
import { Router } from '@reach/router';
import { Dashboard, Home, NotFound } from './pages';

export const App: React.FC = () => {
  return (
    <Router>
      <Home path="/" />
      <Dashboard path="/dashboard" />
      <NotFound default />
    </Router>
  );
};
