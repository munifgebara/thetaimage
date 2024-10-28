import { TipoUsuario } from 'app/entities/enumerations/tipo-usuario.model';

export interface IUsuario {
  id: number;
  nome?: string | null;
  email?: string | null;
  senha?: string | null;
  tipo?: keyof typeof TipoUsuario | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
