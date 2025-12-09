import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Taller } from '../../models/taller.model';
import { TalleresService } from '../../services/talleres/talleres-services';
import { Maestro } from '../../models/maestro.model';
import { MaestrosService } from '../../services/maestros/maestros-services';

@Component({
  selector: 'app-taller',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './taller.html',
  styleUrl: './taller.scss',
})
export class Talleres {
  talleres: Taller[] = [];
  listaMaestros: Maestro[] = [];
  loading = false

  //Control de los modales
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentEditingId: number | null = null;

  //Formulario
  tallerForm: FormGroup;

  //Barra de busqueda que no funciona LOL
  searchText = '';

  constructor(private talleresService: TalleresService, private fb: FormBuilder, private maestrosService: MaestrosService){
    this.tallerForm = this.fb.group({
      nombre_taller: ['', Validators.required],
      horario: ['', Validators.required],
      cupo_maximo: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: ['', Validators.required],
      id_maestro: ['', Validators.required]
    });
  }

  //Primero buscamos a los maestros
  ngOnInit(): void{
    this.loadMaestros();
  }

  loadMaestros(){
    this.maestrosService.getAll().subscribe({
      next: (data) => {
        this.listaMaestros = data;
        //Ya que tenemos los maestros cargamos los talleres
        this.loadTalleres();
      },
      error: (err) => console.error('Error al cargar maestros', err)
    });
  }

   loadTalleres(){
    this.loading = true;
    this.talleresService.getAll().subscribe({next: (data) => {
      this.talleres = data;
      //Hacemos el recorrido de cada taller
      this.talleres.forEach(taller => {
        const maestroEncontrado = this.listaMaestros.find(m => m.id_maestro === taller.id_maestro);

        if(maestroEncontrado){
          //pegamos el nombre en la tabla
          taller.nombre_maestro = `${maestroEncontrado.nombre} ${maestroEncontrado.apellido_paterno}`;
        }else {
          taller.nombre_maestro = 'Sin Asignar'
        }
      });

      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar la tabla talleres', err);
      this.loading = false;
      }
    });
  }

  //ABRIR MODAL
  openAddModal() {
    this.modalMode = 'add';
    this.currentEditingId = null;
    this.tallerForm.reset();
    this.showModal = true;
  }

  //Modal Editar
  openEditModal(talleres: Taller){
    this.modalMode = 'edit';
    this.currentEditingId = talleres.id_taller ?? null;
    this.tallerForm.patchValue({
      nombre_taller: talleres.nombre_taller,
      horario: talleres.horario,
      cupo_maximo: talleres.cupo_maximo,
      tipo: talleres.tipo,
      descripcion: talleres.descripcion,
      id_maestro: talleres.id_maestro
    });
    this.showModal = true;
  }

  //Cerrar el modal
  closeModal(){
    this.showModal = false;
    this.tallerForm.reset();
    this.currentEditingId = null;
  }

  //Guardar
    save(){
      if(this.tallerForm.invalid){
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      const tallerData: Taller = this.tallerForm.value;

      //Funcion para que cuando busque al maestro no le aparezca el id si no el nombre
      const maestroSeleccionado = this.listaMaestros.find(m => m.id_maestro == tallerData.id_maestro);
      if (maestroSeleccionado){
        tallerData.nombre_maestro = `${maestroSeleccionado.nombre} ${maestroSeleccionado.apellido_paterno}`;
      }

      if (this.modalMode === 'add'){
        //Funcion crear
        this.talleresService.create(tallerData).subscribe({
          next: (respuestaApi: any) => {

            console.log('¡Creado!', respuestaApi);

            const nuevoTaller: Taller = {
              ...tallerData,
              id_taller: respuestaApi.id_taller || respuestaApi || respuestaApi.insertId
            };
            //Para que cuando actualize pueda verse
            this.talleres.unshift(nuevoTaller);
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al crear un Taller', err);
          }
        });
      }else if (this.modalMode === 'edit' && this.currentEditingId !== null) {

        tallerData.id_taller = this.currentEditingId;
        //actualizar
        this.talleresService.update(this.currentEditingId, tallerData).subscribe({
          next: () => {
            //Busca y reemplaza
            const idx = this.talleres.findIndex(t => t.id_taller === this.currentEditingId);
            if (idx > -1) {
              this.talleres[idx] = tallerData;
            }
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al actualizar al taller', err);
          }
        });
      }
    }

    //Eliminar
  deleteTaller(id: number){
    if (!confirm('¿Seguro que quiere eliminar este taller?')) return;
    this.talleresService.delete(id).subscribe({
      next: () => {
          //eliminar de la lista
          this.talleres = this.talleres.filter(t => t.id_taller !== id);
      },
      error: (err) => {
        console.error('Error al eliminar al taller', err);
      }
    });
  }
}
