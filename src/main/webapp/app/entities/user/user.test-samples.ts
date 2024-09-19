import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 24988,
  login: 'Ayq',
};

export const sampleWithPartialData: IUser = {
  id: 12527,
  login: 'UGE.lH@l4jK\\qXOb\\5gxn',
};

export const sampleWithFullData: IUser = {
  id: 22903,
  login: 'r8o_9@Lw\\bUO2Q\\fbnNX\\akfR\\8HxB',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
