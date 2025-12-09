import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlumnosService } from '../../services/alumnos/alumnos-service';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-alumno',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alumno.html',
  styleUrl: './alumno.scss',
})
export class Alumnos implements OnInit {
  alumnos: Alumno[] = [];
  loading = false

  //Control de los modales
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentEditingId: number | null = null;

  //Formulario
  alumnoForm: FormGroup;

  //Barra de busqueda
  searchText = '';

  constructor(private alumnosService: AlumnosService, private fb: FormBuilder){
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      edad: ['', Validators.required],
      semestre: ['', Validators.required],
      matricula: ['', Validators.required],
    });
  }

  //Para que aparezcan todos los alumnos
  ngOnInit(): void {
      this.loadAlumnos();
  }
  loadAlumnos(){
    this.loading = true;
    this.alumnosService.getAll().subscribe({next: (data) =>{
      this.alumnos = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar la tabla alumnos', err);
      this.loading = false;
    }
  });
  }

  //Modal Agregar
  openAddModal(){
    this.modalMode = 'add';
    this.currentEditingId = null;
    this.alumnoForm.reset();
    this.showModal = true;
  }

  //Modal Editar
  openEditModal(alumno: Alumno){
    this.modalMode = 'edit';
    this.currentEditingId = alumno.id_alumno ?? null;
    this.alumnoForm.patchValue({
      nombre: alumno.nombre,
      apellido_paterno: alumno.apellido_paterno,
      apellido_materno: alumno.apellido_materno,
      edad: alumno.edad,
      semestre: alumno.semestre,
      matricula: alumno.matricula
    });
    this.showModal = true;
  }

  //Cerrar el modal
  closeModal(){
    this.showModal = false;
    this.alumnoForm.reset();
    this.currentEditingId = null;
  }

  //Crear y actualizar
    save(){
      if(this.alumnoForm.invalid){
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      const alumnoData: Alumno = this.alumnoForm.value;

      if (this.modalMode === 'add'){
        //Funcion crear
        this.alumnosService.create(alumnoData).subscribe({
          next: (respuestaApi: any) => {

            console.log('¡Creado!', respuestaApi);

            const nuevoAlumno: Alumno = {
              ...alumnoData,
              id_alumno: respuestaApi.id_alumno || respuestaApi || respuestaApi.insertId
            };
            //Para que cuando actualize pueda verse
            this.alumnos.unshift(nuevoAlumno);
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al crear un alumno', err);
          }
        });
      }else if (this.modalMode === 'edit' && this.currentEditingId !== null) {

        alumnoData.id_alumno = this.currentEditingId;
        //actualizar
        this.alumnosService.update(this.currentEditingId, alumnoData).subscribe({
          next: () => {
            //Busca y reemplaza
            const idx = this.alumnos.findIndex(a => a.id_alumno === this.currentEditingId);
            if (idx > -1) {
              this.alumnos[idx] = alumnoData;
            }
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al actualizar al alumno', err);
          }
        });
      }
    }

    //Eliminar
  deleteAlumno(id: number){
    if (!confirm('¿Seguro que quiere eliminar este alumno?')) return;
    this.alumnosService.delete(id).subscribe({
      next: () => {
          //eliminar de la lista
          this.alumnos = this.alumnos.filter(a => a.id_alumno !== id);
      },
      error: (err) => {
        console.error('Error al eliminar al alumno', err);
      }
    });
  }

}
