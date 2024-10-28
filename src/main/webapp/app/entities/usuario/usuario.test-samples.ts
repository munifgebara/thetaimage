import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 32249,
};

export const sampleWithPartialData: IUsuario = {
  id: 8686,
};

export const sampleWithFullData: IUsuario = {
  id: 4202,
  nome: 'pro',
  email: 'Gubio_Albuquerque82@hotmail.com',
  senha: 'marimba',
  tipo: 'ADMINISTRADOR',
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
