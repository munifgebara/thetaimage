import { IConjunto, NewConjunto } from './conjunto.model';

export const sampleWithRequiredData: IConjunto = {
  id: 21505,
};

export const sampleWithPartialData: IConjunto = {
  id: 5064,
};

export const sampleWithFullData: IConjunto = {
  id: 12071,
  nome: 'ew',
};

export const sampleWithNewData: NewConjunto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
