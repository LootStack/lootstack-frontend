import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { FichaListModel, FichaModel } from '../models/ficha.models';
import { AplicacaoModel } from '../models/aplicacao.models';

@Injectable({
  providedIn: 'root'
})
export class Ficha {
  private apiUrl = 'https://lootstack-api.onrender.com/api';

  constructor(private http:HttpClient) {}

  public createFicha(novaFicha: {id_porca: string; data_nascimento: string; tipo_porca: string; id_lote:number}): Observable<FichaModel>{
    return this.http.post<FichaModel>(`${this.apiUrl}/fichas-porcas`, novaFicha).pipe(
      catchError(error => {
        console.error('Erro ao criar ficha:', error);
        return throwError(() => new Error("Não foi possível criar ficha"));
      })
    );
  }

  public getFichas(searchTerm: string): Observable<FichaListModel[]> {
    return this.http.get<FichaListModel[]>(`${this.apiUrl}/fichas-porcas?search=${searchTerm}`).pipe(
      catchError(error => {
        console.error('Erro ao obter as ficha:', error);
        return throwError(() => new Error("Não foi possível obter as fichas"));
      })
    );
  }

  public getFichaById(id:string): Observable<FichaModel>{
    return this.http.get<FichaModel>(`${this.apiUrl}/fichas-porcas/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao obter a ficha pelo id:', error);
        return throwError(() => new Error("Não foi possível obter a ficha pelo id fornecido"));
      })
    );
  }

  public getHistoricoVacinacao(id:string): Observable<AplicacaoModel[]>{
    return this.http.get<AplicacaoModel[]>(`${this.apiUrl}/aplicacoes-vacinas?id_porca=${id}`).pipe(
      catchError(error => {
        console.error('Erro ao obter o histórico de vacinação:', error);
        return throwError(() => new Error("Não foi possível obter o histórico de vacinação"));
      })
    );
  }


  public deleteFicha(id:string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fichas-porcas/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao excluir ficha:', error);
        return throwError(() => new Error('Não foi possível excluir a ficha'));
      })
    );
  }
}
