import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs';
import { Lote } from '../../services/lote';
import { LoteModel } from '../../models/lote.models';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lote-consulta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './lote-consulta.html',
  styleUrl: './lote-consulta.scss'
})
export class LoteConsulta implements OnInit {
  public lotes: (LoteModel & { data_criacao_display?: string })[] = [];

  public colunasExibidas: string[] = ['codigo_lote', 'data_criacao'];

  public searchControl: FormControl = new FormControl('');
  public isLoading:boolean = true;
  public error:string | null = null;

  constructor(private loteService: Lote, public authService:Auth){}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        this.error = null;
        return this.loteService.getLotes(term || '');
      })
    ).subscribe({
      next: data => {
        this.lotes = data;
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message;
        this.isLoading = false;
        this.lotes = [];
      }
    });
  }
}
