import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoteModel } from '../models/lote.models';

@Injectable({
  providedIn: 'root'
})
export class Lote {
  private apiUrl: string = 'https://lootstack-api.onrender.com/api/lotes-porcas';

  constructor(private http: HttpClient) { }

  public getLotes(searchTerm: string): Observable<(LoteModel & { data_criacao_display?: string })[]> {
    const endpoint = searchTerm ? `${this.apiUrl}?search=${searchTerm}` : this.apiUrl;
    return this.http.get<LoteModel[]>(endpoint).pipe(
      map(rows => rows.map(r => {
        const raw = r.data_criacao as unknown;

        let dateIso = '';

        if (!raw && raw !== 0) {
          dateIso = '';
        } else if (typeof raw === 'string') {
          const match = raw.match(/\d{4}-\d{2}-\d{2}/);
          dateIso = match ? match[0] : raw;
        } else {
          const maybeDate = new Date(raw as any);
          if (!isNaN(maybeDate.getTime())) {
            dateIso = maybeDate.toISOString().slice(0, 10);
          } else {
            const match = String(raw).match(/\d{4}-\d{2}-\d{2}/);
            dateIso = match ? match[0] : String(raw);
          }
        }

        const [y = '', m = '', d = ''] = dateIso ? dateIso.split('-') : [];

        return {
          ...r,
          data_criacao_display: dateIso ? `${d}/${m}/${y}` : ''
        } as LoteModel & { data_criacao_display?: string };
      })),
      catchError(error => {
        console.error('Erro ao buscar lotes:', error);
        return throwError(() => new Error("Não foi possível carregar os lotes"));
      })
    );
  }

  public createLote(novoLote: { codigo_lote: number; data_criacao: string }): Observable<LoteModel> {
    return this.http.post<LoteModel>(this.apiUrl, novoLote).pipe(
      catchError(error => {
        console.error('Erro ao criar lote:', error);
        return throwError(() => new Error("Não foi possível criar o lote"));
      })
    );
  }
}
