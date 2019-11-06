import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface IHomeProps extends RouteComponentProps {}

export const Home: React.FC<IHomeProps> = () => {
  return (
    <div>
      <p>HOME</p>
    </div>
  );
};
