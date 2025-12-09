import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuarios-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ingresar() {
    if (this.loginForm.invalid) return;

    const datos = this.loginForm.value;

    this.usuariosService.create(datos).subscribe({
      next: (res) => {
        console.log('Usuario guardado:', res);

        //Si se guardó bien redirigimos a Inicio
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al conectar con el servidor');
      }
    });
  }
}
