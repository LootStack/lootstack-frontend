import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AplicacaoModel, AplicacaoPayload } from '../models/aplicacao.models';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Aplicacao {
  private apiUrl = `${environment.apiUrl}/aplicacoes-vacinas`;

  constructor(private http: HttpClient) { }

  public registrarAplicacao(dados: AplicacaoPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, dados).pipe(
      catchError(error => {
        console.error('Erro ao registrar aplicação:', error);
        const errorMessage = error?.error?.message || 'Não foi possível registrar a aplicação';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public getHistoricoAplicacoes(idPorca: string): Observable<AplicacaoModel[]> {
    const endpoint = `${this.apiUrl}?id_porca=${idPorca}`;

    return this.http.get<AplicacaoModel[]>(endpoint).pipe(
      map(aplicacoes => aplicacoes.map(app => this.transformAplicacaoData(app))),
      catchError(error => {
        console.error('Erro ao obter histórico de vacinação:', error);
        const errorMessage = error?.error?.message || 'Não foi possível buscar o histórico de aplicações';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  public deleteAplicacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao deletar aplicação:', error);
        const errorMessage = error?.error?.message || 'Não foi possível deletar o registro';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private transformAplicacaoData(aplicacao: AplicacaoModel): AplicacaoModel {
    if (!aplicacao.data_aplicacao) {
      return aplicacao;
    }

    const date = new Date(aplicacao.data_aplicacao);
    if (isNaN(date.getTime())) {
      return aplicacao;
    }

    const dataCorrigida = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);

    return {
      ...aplicacao,
      data_aplicacao: dataCorrigida.toISOString().slice(0, 10)
    };
  }
}
