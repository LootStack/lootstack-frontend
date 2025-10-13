import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VacinaModel } from '../models/vacina.models';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Vacina {
  private apiUrl = `${environment.apiUrl}/vacinas`;

  constructor(private http: HttpClient){}

  public getVacinas(search: string = ''): Observable<VacinaModel[]> {
    return this.http.get<VacinaModel[]>(`${this.apiUrl}?search=${search}`).pipe(
      catchError(err => throwError(() => new Error('Falha ao buscar vacinas')))
    );
  }

  public createVacina(data: { nome: string }): Observable<VacinaModel> {
    return this.http.post<VacinaModel>(this.apiUrl, data).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Falha ao criar vacina')))
    );
  }

  public deleteVacina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Falha ao deletar vacina')))
    );
  }
}
