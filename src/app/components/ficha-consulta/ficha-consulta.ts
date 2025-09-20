import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, filter, catchError, of, tap } from 'rxjs';
import { Ficha } from '../../services/ficha';
import { AplicacaoModel } from '../../models/aplicacao.models';
import { FichaModel } from '../../models/ficha.models';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ficha-consulta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './ficha-consulta.html',
  styleUrl: './ficha-consulta.scss'
})
export class FichaConsulta implements OnInit {
  public searchControl: FormControl = new FormControl('');
  public fichaSelecionada: FichaModel | null = null;
  public historico: AplicacaoModel[] = [];
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(private fichaService: Ficha, public authService: Auth) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      tap(() => {
        this.isLoading = true;
        this.fichaSelecionada = null;
        this.historico = [];
        this.errorMessage = null;
      }),
      switchMap(term =>
        this.fichaService.getFichaById(term!).pipe(
          catchError(err => {
            this.errorMessage = `Nenhuma ficha encontrada para o ID: ${term}`;
            this.isLoading = false;
            return of(null);
          })
        )
      )
    ).subscribe(ficha => {
      if (ficha) {
        this.fichaSelecionada = ficha;
        this.fichaService.getHistoricoVacinacao(ficha.id_porca).subscribe({
          next: (historico) => {
            this.historico = historico;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erro ao carregar histórico:', err);
            this.historico = [];
            this.isLoading = false;
          }
        });
      }
    });
  }

  public excluirFicha(idPorca?: string): void {
    const idToDelete = idPorca ?? this.fichaSelecionada?.id_porca;
    if (!idToDelete) {
      window.alert('Não foi possível identificar o ID da ficha para remoção.');
      return;
    }

    const confirmar = window.confirm(
      `Deseja remover a ficha da porca ${idToDelete}? Esta ação é irreversível!`
    );
    if (!confirmar) return;

    this.fichaService.deleteFicha(idToDelete).subscribe({
      next: () => {
        this.fichaSelecionada = null;
        this.historico = [];
        window.alert('Ficha removida com sucesso');
      },
      error: err => {
        console.error('Erro ao remover ficha:', err);
        const backendMsg = err?.error?.message ?? err?.message ?? 'erro desconhecido';
        window.alert('Falha ao remover ficha: ' + backendMsg);
      }
    });
  }
}
