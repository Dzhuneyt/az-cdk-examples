import { ILambda, IEvent, IResult, response } from '@cpmech/az-lambda';

export const open: ILambda = async (event: IEvent): Promise<IResult> => {
  return response.ok({ message: `OPEN ACCESS: path = ${event.path}` });
};
