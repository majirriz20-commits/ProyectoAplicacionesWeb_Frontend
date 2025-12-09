import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maestro } from '../../models/maestro.model';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  private apiURL = 'http://localhost:3000/maestros';

  constructor(private http:  HttpClient) {}

  //Todos los maestros
  getAll(): Observable<Maestro[]>{
    return this.http.get<Maestro[]>(this.apiURL);
  }

  //POST
  create(maestro: Maestro): Observable<Maestro> {
    return this.http.post<Maestro>(this.apiURL, maestro);
  }

  //PATCH
  update(id: number, maestro: Maestro): Observable<Maestro> {
    return this.http.patch<Maestro>(`${this.apiURL}/${id}`, maestro);
  }

  //DELETE
  delete(id: number): Observable<any>{
    return this.http.delete(`${this.apiURL}/${id}`);
  }

}
