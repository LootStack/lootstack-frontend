import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoteModel } from '../models/lote.models';

@Injectable({
  providedIn: 'root'
})
export class Lote {
  private apiUrl: string = 'http://localhost:3000/api/lotes-porcas';

  constructor(private http: HttpClient) { }

  public getLotes(searchTerm: string): Observable<(LoteModel & { data_criacao_display?: string })[]> {
    const endpoint = searchTerm ? `${this.apiUrl}?search=${searchTerm}` : this.apiUrl;

    return this.http.get<LoteModel[]>(endpoint).pipe(
      map(lotes => lotes.map(lote => this.transformLoteData(lote))),
      catchError(error => {
        console.error('Erro ao buscar lotes:', error);
        return throwError(() => new Error("Não foi possível carregar os lotes"));
      })
    );
  }

  private transformLoteData(lote: LoteModel): LoteModel & { data_criacao_display?: string } {
    if (!lote.data_criacao) {
      return { ...lote, data_criacao_display: '' };
    }

    const date = new Date(lote.data_criacao);

    if (isNaN(date.getTime())) {
      return { ...lote, data_criacao_display: 'Data inválida' };
    }

    const dataCorrigida = date.toISOString().slice(0, 10);

    const [ano, mes, dia] = dataCorrigida.split('-');
    const dataDisplay = `${dia}/${mes}/${ano}`;

    return {
      ...lote,
      data_criacao: dataCorrigida,
      data_criacao_display: dataDisplay
    };
  }

  public createLote(novoLote: { codigo_lote: number; data_criacao: string }): Observable<LoteModel> {
    return this.http.post<LoteModel>(this.apiUrl, novoLote).pipe(
      catchError(error => {
        console.error('Erro ao criar lote:', error);
        return throwError(() => new Error("Não foi possível criar o lote"));
      })
    );
  }

  public deleteLote(id: number): Observable<void> {
    const endpoint = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(endpoint).pipe(
      catchError(error => {
        console.error('Erro ao deletar lote:', error);
        const msg = error?.error?.message ?? "Não foi possível deletar o lote";
        return throwError(() => new Error(msg));
      })
    );
  }
}
