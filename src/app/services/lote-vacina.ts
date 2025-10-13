import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoteVacinaModel } from '../models/loteVacina.models';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoteVacina {
  private apiUrl = `${environment.apiUrl}/lotes-vacinas`;

  constructor(private http: HttpClient) { }

  public getLotes(search: string = ''): Observable<LoteVacinaModel[]> {
    return this.http.get<LoteVacinaModel[]>(`${this.apiUrl}?search=${search}`).pipe(
      catchError(err => throwError(() => new Error('Falha ao buscar lotes de vacinas')))
    );
  }

  public createLote(data: any): Observable<LoteVacinaModel> {
    return this.http.post<LoteVacinaModel>(this.apiUrl, data).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Falha ao criar lote')))
    );
  }

  public deleteLote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => throwError(() => new Error(err.error?.message || 'Falha ao deletar lote')))
    );
  }
}
