import React from 'react';
import { RouteComponentProps } from '@reach/router';

interface INotFoundProps extends RouteComponentProps {}

export const NotFound: React.FC<INotFoundProps> = () => {
  return (
    <div>
      <p>NOT FOUND</p>
    </div>
  );
};
