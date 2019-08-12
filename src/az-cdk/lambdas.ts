import { ILambdaApiSpec } from '@cpmech/az-cdk';

export const lambdas: ILambdaApiSpec[] = [
  {
    filenameKey: 'open',
    handlerName: 'open',
    httpMethods: ['GET'],
    route: 'open',
    unprotected: true,
  },
  {
    filenameKey: 'closed',
    handlerName: 'closed',
    httpMethods: ['GET'],
    route: 'closed',
  },
  {
    filenameKey: 'graphql',
    handlerName: 'server',
    httpMethods: ['POST'],
    route: 'graphql',
    unprotected: true,
  },
];
