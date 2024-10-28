import { IEtiquetagem, NewEtiquetagem } from './etiquetagem.model';

export const sampleWithRequiredData: IEtiquetagem = {
  id: 25464,
};

export const sampleWithPartialData: IEtiquetagem = {
  id: 31491,
  x: 6959.16,
  y: 22235.27,
  largura: 30723.55,
};

export const sampleWithFullData: IEtiquetagem = {
  id: 3142,
  x: 23931.76,
  y: 12263.16,
  largura: 1813.41,
  altura: 27656.23,
};

export const sampleWithNewData: NewEtiquetagem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
