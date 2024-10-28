import { IClasse, NewClasse } from './classe.model';

export const sampleWithRequiredData: IClasse = {
  id: 28775,
};

export const sampleWithPartialData: IClasse = {
  id: 32522,
  nome: 'cull junket',
};

export const sampleWithFullData: IClasse = {
  id: 8122,
  nome: 'knottily',
};

export const sampleWithNewData: NewClasse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
