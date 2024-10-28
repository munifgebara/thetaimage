import { IDataset, NewDataset } from './dataset.model';

export const sampleWithRequiredData: IDataset = {
  id: 1153,
};

export const sampleWithPartialData: IDataset = {
  id: 8079,
  descricao: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IDataset = {
  id: 26224,
  nome: 'colorfully how frontier',
  descricao: '../fake-data/blob/hipster.txt',
  diferencaMinima: 14092.99,
};

export const sampleWithNewData: NewDataset = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
