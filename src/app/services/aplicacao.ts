import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AplicacaoModel, AplicacaoPayload } from '../models/aplicacao.models';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Aplicacao {
  private apiUrl = 'https://lootstack-api.onrender.com/api/aplicacoes-vacinas';

  constructor(private http: HttpClient) { }

  public registrarAplicacao(dados: AplicacaoPayload): Observable<AplicacaoModel> {
    return this.http.post<AplicacaoModel>(this.apiUrl, dados).pipe(
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

  private transformAplicacaoData(aplicacao: AplicacaoModel): AplicacaoModel {
    if (!aplicacao.data_aplicacao) {
      return aplicacao;
    }
  
    const date = new Date(aplicacao.data_aplicacao);
    if (isNaN(date.getTime())) {
      return aplicacao;
    }
  
    date.setDate(date.getDate());
  
    return {
      ...aplicacao,
      data_aplicacao: date.toISOString().slice(0, 10)
    };
  }
}
