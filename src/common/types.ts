export interface IAccess {
  userId: string;
  aspect: 'ACCESS';
  role: 'TRAVELLER';
  email: string;
}

export const newAccess = (): IAccess => ({
  userId: '',
  aspect: 'ACCESS',
  role: 'TRAVELLER',
  email: '',
});
