import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FichaListModel, FichaModel } from '../models/ficha.models';
import { AplicacaoModel } from '../models/aplicacao.models';

@Injectable({
  providedIn: 'root'
})
export class Ficha {
  private apiUrl = 'https://lootstack-api.onrender.com/api';

  constructor(private http: HttpClient) { }

  public createFicha(novaFicha: { id_porca: string; data_nascimento: string; tipo_porca: string; id_lote: number }): Observable<FichaModel> {
    return this.http.post<FichaModel>(`${this.apiUrl}/fichas-porcas`, novaFicha).pipe(
      catchError(error => {
        console.error('Erro ao criar ficha:', error);
        return throwError(() => new Error("Não foi possível criar ficha"));
      })
    );
  }

  private transformFichaData<T extends { data_nascimento: string }>(ficha: T): T {
    if (!ficha.data_nascimento) {
      return ficha;
    }

    const date = new Date(ficha.data_nascimento);

    if (isNaN(date.getTime())) {
      return ficha;
    }

    const dataCorrigida = date.toISOString().slice(0, 10);

    return {
      ...ficha,
      data_nascimento: dataCorrigida
    };
  }

  public getFichas(searchTerm: string, loteId: string): Observable<FichaListModel[]> {
    const params = new URLSearchParams();

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    if (loteId) {
      params.append('lote', loteId);
    }

    const queryString = params.toString();
    const requestUrl = `${this.apiUrl}/fichas-porcas${queryString ? '?' + queryString : ''}`;

    return this.http.get<FichaListModel[]>(requestUrl).pipe(
      map(fichas => fichas.map(ficha => this.transformFichaData(ficha))),
      catchError(error => {
        console.error('Erro ao obter as fichas:', error);
        return throwError(() => new Error("Não foi possível obter as fichas"));
      })
    );
  }

  public getFichaById(id: string): Observable<FichaModel> {
    return this.http.get<FichaModel>(`${this.apiUrl}/fichas-porcas/${id}`).pipe(
      map(ficha => this.transformFichaData(ficha)),
      catchError(error => {
        console.error('Erro ao obter a ficha pelo id:', error);
        return throwError(() => new Error("Não foi possível obter a ficha pelo id fornecido"));
      })
    );
  }

  public getHistoricoVacinacao(id: string): Observable<AplicacaoModel[]> {
    return this.http.get<AplicacaoModel[]>(`${this.apiUrl}/aplicacoes-vacinas?id_porca=${id}`).pipe(
      catchError(error => {
        console.error('Erro ao obter o histórico de vacinação:', error);
        return throwError(() => new Error("Não foi possível obter o histórico de vacinação"));
      })
    );
  }


  public deleteFicha(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fichas-porcas/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao excluir ficha:', error);
        return throwError(() => new Error('Não foi possível excluir a ficha'));
      })
    );
  }
}
