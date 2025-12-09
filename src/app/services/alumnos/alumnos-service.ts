import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../../models/alumno.model';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private apiURL = 'http://localhost:3000/alumnos';

  constructor(private http: HttpClient) {}

  //Todos los alumnos
  getAll(): Observable<Alumno[]>{
      return this.http.get<Alumno[]>(this.apiURL);
    }

    //POST
    create(alumno: Alumno): Observable<Alumno> {
      return this.http.post<Alumno>(this.apiURL, alumno);
    }

    //PATCH
    update(id: number | string, alumno: Alumno): Observable<Alumno> {
      return this.http.patch<Alumno>(`${this.apiURL}/${id}`, alumno);
    }

    //DELETE
    delete(id: number | string): Observable<any>{
      return this.http.delete(`${this.apiURL}/${id}`);
    }
}
