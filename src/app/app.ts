import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//Layout
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { FooterInicio } from './footer-inicio/footer-inicio';
//Los componentes
import { Maestros } from './pages/maestros/maestros';
import { Alumnos } from './pages/alumnos/alumno';
import { Talleres } from './pages/talleres/taller';
import { Inscripciones } from './pages/inscripciones/inscripciones';
import { Usuarios } from './pages/usuarios/usuarios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    Navbar,
    Footer,
    CommonModule,
    FooterInicio,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  //Para mostrar el footer
  public soloInicio = true;
  //Para mostrar la barra para login
  public mostrarMenu = false;

  constructor (private router: Router) {}

  ngOnInit() {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        //Para el footer
        if (event.url === '/inicio' || event.url === '/'){
          this.soloInicio = true;
        } else{
          this.soloInicio = false;
        }

        //Para el login
        if(event.url === '/login' || event.url === '/'){
          this.mostrarMenu =  false;
        }else {
          this.mostrarMenu = true;
        }
      });
  }



  protected readonly title = signal('app-frontend-standalone');
  rutaImagen: string = 'img/'
}
