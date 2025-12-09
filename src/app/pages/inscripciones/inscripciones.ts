import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'; // <--- Junté los imports
//Servicios
import { InscripcionesServices } from '../../services/inscripciones/inscripciones-services';
import { TalleresService } from '../../services/talleres/talleres-services';
import { AlumnosService } from '../../services/alumnos/alumnos-service';
//Modelos
import { Inscripcion } from '../../models/inscripcion.model';
import { Alumno } from '../../models/alumno.model';
import { Taller } from '../../models/taller.model';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.scss',
})
export class Inscripciones implements OnInit {
  inscripciones: Inscripcion[] = [];
  listaAlumnos: Alumno[] = [];
  listaTalleres: Taller[] = [];
  loading = false;

  // Control del Modal
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentEditingId: number | null = null;

  // Formulario
  inscripcionForm: FormGroup;
  searchText = '';

  constructor(
    private inscripcionesService: InscripcionesServices,
    private alumnosService: AlumnosService,
    private talleresService: TalleresService,
    private fb: FormBuilder
  ) {
    this.inscripcionForm = this.fb.group({
      id_alumno: ['', Validators.required],
      id_taller: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // ERROR 1 CORREGIDO: ¡Te faltaba cargar la tabla principal!
    this.loadInscripciones();

    // Cargamos las listas para los dropdowns
    this.loadListasParaModal();
  }

  loadInscripciones() {
    this.loading = true;
    this.inscripcionesService.getAll().subscribe({
      next: (data) => {
        console.log('Datos cargados:', data); // <--- Agregué esto para verificar que llegan los datos
        this.inscripciones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar inscripciones', err);
        this.loading = false;
      }
    });
  }

  loadListasParaModal() {
    this.alumnosService.getAll().subscribe({
      next: (data) => this.listaAlumnos = data,
      error: (err) => console.error('Error cargando alumnos', err)
    });

    this.talleresService.getAll().subscribe({
      next: (data) => this.listaTalleres = data,
      error: (err) => console.error('Error cargando talleres', err)
    });
  }

  // Abrir Modal Agregar
  openAddModal() {
    this.modalMode = 'add';
    this.currentEditingId = null;
    this.inscripcionForm.reset();
    // Ponemos cadenas vacías para que el select muestre la opción por defecto "Selecciona..."
    this.inscripcionForm.patchValue({id_alumno: '', id_taller: ''});
    this.showModal = true;
  }

  // Abrir Modal Editar
  openEditModal(inscripcion: Inscripcion) {
    this.modalMode = 'edit';

    // ERROR 2 (POSIBLE): Asegúrate que tu backend devuelve "id_inscripcion" exactamente así
    console.log('ID a editar:', inscripcion.id_inscripcion);
    this.currentEditingId = inscripcion.id_inscripcion ?? null;

    // Rellenamos el formulario
    this.inscripcionForm.patchValue({
      id_alumno: inscripcion.id_alumno,
      id_taller: inscripcion.id_taller
    });

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.inscripcionForm.reset();
    this.currentEditingId = null;
  }

  save() {
    if (this.inscripcionForm.invalid) {
      alert('Por favor selecciona un alumno y un taller.');
      return;
    }

    // Convertimos a número para asegurar compatibilidad con MySQL
    const datosParaEnviar = {
      id_alumno: Number(this.inscripcionForm.value.id_alumno),
      id_taller: Number(this.inscripcionForm.value.id_taller)
    };

    console.log('Enviando datos:', datosParaEnviar);

    if (this.modalMode === 'add') {
      this.inscripcionesService.create(datosParaEnviar).subscribe({
        next: () => {
          this.loadInscripciones(); // Recarga la tabla
          this.closeModal();
        },
        error: (err) => console.error('Error al inscribir', err)
      });

    } else if (this.modalMode === 'edit' && this.currentEditingId !== null) {

      console.log('Enviando Update al ID:', this.currentEditingId);

      this.inscripcionesService.update(this.currentEditingId, datosParaEnviar).subscribe({
        next: () => {
          // ERROR 3 (VISUAL): A veces la recarga es tan rápida que no ves el cambio.
          // El loadInscripciones aquí es correcto.
          this.loadInscripciones();
          this.closeModal();
          alert('¡Actualizado correctamente!');
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('No se pudo actualizar. Revisa la consola.');
        }
      });
    }
  }

  deleteInscripcion(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta inscripción?')) return;

    this.inscripcionesService.delete(id).subscribe({
      next: () => {
        // Opción A: Filtrar localmente (Más rápido visualmente)
        this.inscripciones = this.inscripciones.filter(i => i.id_inscripcion !== id);

        // Opción B (Más segura): Recargar todo
        // this.loadInscripciones();
      },
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}
