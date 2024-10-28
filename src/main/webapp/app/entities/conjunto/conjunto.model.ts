import { IDataset } from 'app/entities/dataset/dataset.model';

export interface IConjunto {
  id: number;
  nome?: string | null;
  dataset?: IDataset | null;
}

export type NewConjunto = Omit<IConjunto, 'id'> & { id: null };
