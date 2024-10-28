import { IDataset } from 'app/entities/dataset/dataset.model';

export interface IEtiqueta {
  id: number;
  nome?: string | null;
  dataset?: IDataset | null;
}

export type NewEtiqueta = Omit<IEtiqueta, 'id'> & { id: null };
