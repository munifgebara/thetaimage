import { IDataset } from 'app/entities/dataset/dataset.model';

export interface IClasse {
  id: number;
  nome?: string | null;
  dataset?: IDataset | null;
}

export type NewClasse = Omit<IClasse, 'id'> & { id: null };
