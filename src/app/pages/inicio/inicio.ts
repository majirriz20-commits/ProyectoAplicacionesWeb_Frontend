import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  //para que funcionen los botones
  botones = [
    {
      titulo: 'Maestros',
      img: 'assets/Teacher.png',
      url: '/maestros',
    },
    {
      titulo: 'Alumnos',
      img: 'assets/Graduate.png',
      url: '/alumno',
    },
    {
      titulo: 'Talleres',
      img: 'assets/Exercise.png',
      url: '/taller',
    },
    {
      titulo: 'Inscripciones',
      img: 'assets/Inscription.png',
      url: '/inscripciones',
    }
  ];
}
