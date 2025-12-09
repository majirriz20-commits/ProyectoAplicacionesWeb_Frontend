import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios/usuarios-service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    this.usuariosService.getAll().subscribe({next: (data) => {
      this.usuarios = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar la tabla usuarios', err);
      this.loading = false;
    }
  })
  }

  deleteUsuario(id: number) {
    if(!confirm('¿Estas seguro de que quieres borrar a este usuario?')) return;
    this.usuariosService.delete(id).subscribe({
      next: () => {
        this.loadUsuarios();
      },
      error: (err) => console.error('Error al eliminar', err)
    })
  }
}
