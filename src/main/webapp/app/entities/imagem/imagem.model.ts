import { IDataset } from 'app/entities/dataset/dataset.model';
import { IConjunto } from 'app/entities/conjunto/conjunto.model';
import { IClasse } from 'app/entities/classe/classe.model';

export interface IImagem {
  id: number;
  nome?: string | null;
  caminho?: string | null;
  mimeType?: string | null;
  largura?: number | null;
  altura?: number | null;
  dados?: string | null;
  dadosContentType?: string | null;
  dataset?: IDataset | null;
  conjunto?: IConjunto | null;
  classe?: IClasse | null;
}

export type NewImagem = Omit<IImagem, 'id'> & { id: null };
