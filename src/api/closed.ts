import { ILambda, IEvent, IResult, response } from '@cpmech/az-lambda';

export const closed: ILambda = async (event: IEvent): Promise<IResult> => {
  return response.ok({ message: `RESTRICTED: path = ${event.path}` });
};
