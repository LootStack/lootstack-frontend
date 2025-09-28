import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FichaListModel } from '../../models/ficha.models';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap, combineLatest } from 'rxjs';
import { Ficha } from '../../services/ficha';
import { LoteModel } from '../../models/lote.models';
import { Lote } from '../../services/lote';

@Component({
  selector: 'app-ficha-consulta-total',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './ficha-consulta-total.html',
  styleUrl: './ficha-consulta-total.scss'
})
export class FichaConsultaTotal implements OnInit {
  public searchControl: FormControl = new FormControl('');
  public loteControl: FormControl = new FormControl(''); 
  public listaLotes: LoteModel[] = []; 

  public dataSource: MatTableDataSource<FichaListModel> = new MatTableDataSource<FichaListModel>();
  public displayedColumns: string[] = ['id_porca', 'data_nascimento', 'codigo_lote'];
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor( private fichaService: Ficha, private loteService: Lote) { }

  
  ngOnInit(): void {
    
    this.loteService.getLotes('').subscribe(lotes => {
      this.listaLotes = lotes;
    });

    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')), 
      this.loteControl.valueChanges.pipe(startWith('')),   
    ])
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(() => (this.isLoading = true)), 
        switchMap(([term, loteId]) =>
          this.fichaService.getFichas(term || '', loteId || '').pipe(
            catchError((error) => {
              this.errorMessage = 'Erro ao buscar as fichas. Tente novamente';
              return of([]);
            })
          )
        )
      )
      .subscribe((fichas) => {
        this.dataSource.data = fichas;
        this.isLoading = false;
      });
  }
}
