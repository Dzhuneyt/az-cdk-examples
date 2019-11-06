import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface IDashboardProps extends RouteComponentProps {}

export const Dashboard: React.FC<IDashboardProps> = () => {
  return (
    <div>
      <p>DASHBOARD</p>
    </div>
  );
};
