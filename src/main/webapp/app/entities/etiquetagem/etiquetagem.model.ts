import { IEtiqueta } from 'app/entities/etiqueta/etiqueta.model';
import { IImagem } from 'app/entities/imagem/imagem.model';

export interface IEtiquetagem {
  id: number;
  x?: number | null;
  y?: number | null;
  largura?: number | null;
  altura?: number | null;
  etiqueta?: IEtiqueta | null;
  imagem?: IImagem | null;
}

export type NewEtiquetagem = Omit<IEtiquetagem, 'id'> & { id: null };
