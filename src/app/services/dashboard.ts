import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DashboardStatsModel } from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  private apiUrl = 'https://lootstack-api.onrender.com/api/dashboard';

  constructor(private http: HttpClient) { }

  public getStats(): Observable<DashboardStatsModel> {
    return this.http.get<DashboardStatsModel>(`${this.apiUrl}/stats`).pipe(
      catchError(err => throwError(() => new Error('Falha ao buscar estatísticas')))
    );
  }

  public getAplicacoesPorMes(): Observable<{ mes: string; total: string }[]> {
    return this.http.get<{ mes: string; total: string }[]>(`${this.apiUrl}/aplicacoes-por-mes`).pipe(
      catchError(err => throwError(() => new Error('Falha ao buscar dados do gráfico')))
    );
  }
}
