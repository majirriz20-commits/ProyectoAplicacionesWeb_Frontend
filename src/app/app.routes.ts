import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Maestros } from './pages/maestros/maestros';
import { Alumnos } from './pages/alumnos/alumno';
import { Talleres } from './pages/talleres/taller';
import { Inscripciones } from './pages/inscripciones/inscripciones';
import { Usuarios } from './pages/usuarios/usuarios';
import { Login } from './pages/login/login';

export const routes: Routes = [
  //LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {path: "inicio", component: Inicio},
  {path: "maestros", component: Maestros},
  {path: "alumno", component: Alumnos},
  {path: "taller", component: Talleres},
  {path: "inscripciones", component: Inscripciones},
  { path: 'usuarios', component: Usuarios },
];
