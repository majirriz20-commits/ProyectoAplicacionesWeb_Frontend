export interface Taller{
  id_taller?: number;
  nombre_taller: string;
  horario: 'MATUTINO' | 'VESPERTINO';
  cupo_maximo: number;
  tipo: string;
  descripcion: string;
  id_maestro?: number | null;
  nombre_maestro?: string
}
