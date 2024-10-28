import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IDataset {
  id: number;
  nome?: string | null;
  descricao?: string | null;
  diferencaMinima?: number | null;
  usuario?: IUsuario | null;
}

export type NewDataset = Omit<IDataset, 'id'> & { id: null };
