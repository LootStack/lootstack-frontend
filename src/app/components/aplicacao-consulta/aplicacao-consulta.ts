import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Aplicacao } from '../../services/aplicacao';
import { AplicacaoModel } from '../../models/aplicacao.models';
import { Auth } from '../../services/auth';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';

@Component({
  selector: 'app-aplicacao-consulta',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, DatePipe,
    MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatProgressSpinnerModule, MatButtonModule, MatDialogModule,
    Confirmacao
  ],
  templateUrl: './aplicacao-consulta.html',
  styleUrl: './aplicacao-consulta.scss'
})
export class AplicacaoConsulta implements OnInit {
  public historico: AplicacaoModel[] = [];
  public colunasExibidas: string[] = [
    'data_aplicacao',
    'id_porca',
    'nome_vacina',
    'codigo_lote_vacina',
    'dose_aplicada_ml',
    'nome_aplicador'
  ];
  public searchControl = new FormControl('');
  public isLoading = true;
  public error: string | null = null;

  constructor(private aplicacaoService: Aplicacao, public authService: Auth, private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.colunasExibidas.push('acoes');
    }

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        this.error = null;
        return this.aplicacaoService.getHistoricoAplicacoes(term || '');
      })
    ).subscribe({
      next: data => {
        this.historico = data;
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message || 'Falha ao carregar o histórico';
        this.isLoading = false;
        this.historico = [];
      }
    });
  }

  public onDeleteAplicacao(item: AplicacaoModel): void {
    const dialogRef = this.dialog.open(Confirmacao, {
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja remover o registro de aplicação da vacina "${item.nome_vacina}" na porca "${item.id_porca}"?`,
        mostrarBotaoCancelar: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.aplicacaoService.deleteAplicacao(item.id_aplicacao).subscribe({
          next: () => {
            this.historico = this.historico.filter(h => h.id_aplicacao !== item.id_aplicacao);
            this.dialog.open(Confirmacao, { data: { titulo: 'Sucesso!', mensagem: 'Registro removido com sucesso' }});
          },
          error: (err) => {
            this.dialog.open(Confirmacao, { data: { titulo: 'Erro', mensagem: err.message }});
          }
        });
      }
    });
  }
}
