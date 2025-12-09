import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../../models/inscripcion.model';
@Injectable({
  providedIn: 'root',
})
export class InscripcionesServices {
  private apiURL = 'http://localhost:3000/inscripciones';

  constructor(private http: HttpClient) {}

  //Todos los inscripciones
  getAll(): Observable<Inscripcion[]>{
      return this.http.get<Inscripcion[]>(this.apiURL);
    }

    //POST
    create(inscripcion: Inscripcion): Observable<Inscripcion> {
      return this.http.post<Inscripcion>(this.apiURL, inscripcion);
    }

    //PATCH
    update(id: number | string, inscripcion: Inscripcion): Observable<Inscripcion> {
      return this.http.patch<Inscripcion>(`${this.apiURL}/${id}`, inscripcion);
    }

    //DELETE
    delete(id: number | string): Observable<any>{
      return this.http.delete(`${this.apiURL}/${id}`);
    }
}

