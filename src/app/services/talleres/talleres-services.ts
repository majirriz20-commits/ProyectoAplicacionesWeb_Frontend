import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taller } from '../../models/taller.model';

@Injectable({
  providedIn: 'root',
})
export class TalleresService {
  private apiURL = 'http://localhost:3000/talleres';

    constructor(private http:  HttpClient) {}

    //Todos los Talleres
    getAll(): Observable<Taller[]>{
      return this.http.get<Taller[]>(this.apiURL);
    }

    //POST
    create(taller: Taller): Observable<Taller> {
      return this.http.post<Taller>(this.apiURL, taller);
    }

    //PATCH
    update(id: number, taller: Taller): Observable<Taller> {
      return this.http.patch<Taller>(`${this.apiURL}/${id}`, taller);
    }

    //DELETE
    delete(id: number): Observable<any>{
      return this.http.delete(`${this.apiURL}/${id}`);
    }

}
