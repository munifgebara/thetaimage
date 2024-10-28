import { IImagem, NewImagem } from './imagem.model';

export const sampleWithRequiredData: IImagem = {
  id: 11491,
};

export const sampleWithPartialData: IImagem = {
  id: 8567,
  nome: 'quaintly',
  largura: 26870,
  altura: 6925,
  dados: '../fake-data/blob/hipster.png',
  dadosContentType: 'unknown',
};

export const sampleWithFullData: IImagem = {
  id: 16505,
  nome: 'till gah',
  caminho: 'garage',
  mimeType: 'absent',
  largura: 12130,
  altura: 19719,
  dados: '../fake-data/blob/hipster.png',
  dadosContentType: 'unknown',
};

export const sampleWithNewData: NewImagem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
