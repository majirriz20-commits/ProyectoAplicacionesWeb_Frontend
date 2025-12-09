import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaestrosService } from '../../services/maestros/maestros-services';
import { Maestro } from '../../models/maestro.model';

@Component({
  selector: 'app-maestros',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './maestros.html',
  styleUrl: './maestros.scss',
})
export class Maestros implements OnInit {
  maestros: Maestro[] = [];
  loading = false

  //Control de los modales
  showModal = false;
  modalMode: 'add' | 'edit' = 'add'; //definimos que va a hacer los modales
  currentEditingId: number | null = null;

  //Formulario
  maestroForm: FormGroup;

  //Barra de busqueda que no funciona LOL
  searchText = '';

  constructor(private maestrosService: MaestrosService, private fb: FormBuilder){
    this.maestroForm =  this.fb.group({
      nombre: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //solo acepta correos que de verdad tengan forma de correo
      especialidad: ['', Validators.required]
    });
  }

  //Para que aparezcan todos los maestros
  ngOnInit(): void {
      this.loadMaestros();
  }

  loadMaestros(){
    this.loading = true;
    this.maestrosService.getAll().subscribe({next: (data) =>{
      this.maestros = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar la tabal maestros', err);
      this.loading = false;
      }
    });
  }

  //Abrir el modal AGREGAR
  openAddModal(){
    this.modalMode = 'add'; //le dice lo que va a hacer
    this.currentEditingId = null;
    this.maestroForm.reset();
    this.showModal = true;
  }

  //Abrir el modal EDITAR
  openEditModal(maestro: Maestro){
    this.modalMode = 'edit';
    this.currentEditingId = maestro.id_maestro ?? null;
    this.maestroForm.patchValue({
      nombre: maestro.nombre,
      apellido_paterno: maestro.apellido_paterno,
      apellido_materno: maestro.apellido_materno,
      telefono: maestro.telefono,
      email: maestro.email,
      especialidad: maestro.especialidad
    });
    this.showModal = true;
  }

  //Cerrar el modal
  closeModal(){
    this.showModal = false;
    this.maestroForm.reset();
    this.currentEditingId = null;
  }

  //Guardar
  save(){
    if(this.maestroForm.invalid){
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const maestroData: Maestro = this.maestroForm.value;

    if (this.modalMode === 'add'){
      //Funcion crear
      this.maestrosService.create(maestroData).subscribe({
        next: (respuestaApi: any) => {

          console.log('¡Creado!', respuestaApi);

          const nuevoMaestro: Maestro = {
            ...maestroData,
            id_maestro: respuestaApi.id_maestro || respuestaApi || respuestaApi.insertId
          };
          //Para que cuando actualize pueda verse
          this.maestros.unshift(nuevoMaestro);
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear un maestro', err);
        }
      });
    }else if (this.modalMode === 'edit' && this.currentEditingId !== null) {

      maestroData.id_maestro = this.currentEditingId;
      //actualizar
      this.maestrosService.update(this.currentEditingId, maestroData).subscribe({
        next: () => {
          //Busca y reemplaza
          const idx = this.maestros.findIndex(m => m.id_maestro === this.currentEditingId);
          if (idx > -1) {
            this.maestros[idx] = maestroData;
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al actualizar al maestro', err);
        }
      });
    }
  }

  //Eliminar
  deleteMaestro(id: number){
    if (!confirm('¿Seguro que quiere eliminar este maestro?')) return;
    this.maestrosService.delete(id).subscribe({
      next: () => {
          //eliminar de la lista
          this.maestros = this.maestros.filter(m => m.id_maestro !== id);
      },
      error: (err) => {
        console.error('Error al eliminar al maestro', err);
      }
    });
  }

}
