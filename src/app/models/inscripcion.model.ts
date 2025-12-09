export interface Inscripcion {
    id_inscripcion?: number;
    id_alumno: number;
    id_taller: number;
    nombre_alumno?: string;
    apellido_paterno?: string;
    nombre_taller?: string;
    horario?: string;
    fecha_inscripcion?: string;
}
