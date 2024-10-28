import { IEtiqueta, NewEtiqueta } from './etiqueta.model';

export const sampleWithRequiredData: IEtiqueta = {
  id: 14157,
};

export const sampleWithPartialData: IEtiqueta = {
  id: 6605,
  nome: 'meaty as',
};

export const sampleWithFullData: IEtiqueta = {
  id: 32363,
  nome: 'rawhide',
};

export const sampleWithNewData: NewEtiqueta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
