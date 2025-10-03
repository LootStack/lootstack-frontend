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

import { Aplicacao } from '../../services/aplicacao';
import { AplicacaoModel } from '../../models/aplicacao.models';

@Component({
  selector: 'app-aplicacao-consulta',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, DatePipe,
    MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatProgressSpinnerModule, MatButtonModule
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

  constructor(private aplicacaoService: Aplicacao) { }

  ngOnInit(): void {
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
        this.error = err.message || 'Falha ao carregar o histórico.';
        this.isLoading = false;
        this.historico = [];
      }
    });
  }
}
