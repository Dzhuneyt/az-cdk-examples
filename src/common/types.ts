export interface IAccess {
  itemId: string;
  aspect: 'ACCESS';
  role: 'TRAVELLER';
  email: string;
  fullName?: string;
}

export const zeroAccess = (): IAccess => ({
  itemId: '',
  aspect: 'ACCESS',
  role: 'TRAVELLER',
  email: '',
  fullName: '',
});
