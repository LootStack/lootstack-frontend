import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FichaListModel } from '../../models/ficha.models';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap, combineLatest, Observable, map } from 'rxjs';
import { Ficha } from '../../services/ficha';
import { LoteModel } from '../../models/lote.models';
import { Lote } from '../../services/lote';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ficha-consulta-total',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatTableModule, MatProgressSpinnerModule,
    MatButtonModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './ficha-consulta-total.html',
  styleUrl: './ficha-consulta-total.scss'
})
export class FichaConsultaTotal implements OnInit {
  public searchControl = new FormControl('');
  public loteControl = new FormControl<string | LoteModel>('');

  public lotesFiltrados$!: Observable<LoteModel[]>;

  public dataSource = new MatTableDataSource<FichaListModel>();
  public displayedColumns: string[] = ['id_porca', 'data_nascimento', 'codigo_lote'];
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(private fichaService: Ficha, private loteService: Lote) { }


  ngOnInit(): void {
    this.lotesFiltrados$ = this.loteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : '';
        return this.loteService.getLotes(searchTerm);
      })
    );

    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.loteControl.valueChanges.pipe(startWith(null)),
    ])
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(([term, lote]) => {
          const loteId = (typeof lote === 'object' && lote?.id_lote) ? lote.id_lote.toString() : '';
          return this.fichaService.getFichas(term || '', loteId).pipe(
            catchError((error) => {
              this.errorMessage = 'Erro ao buscar as fichas. Tente novamente';
              return of([]);
            })
          );
        })
      )
      .subscribe((fichas) => {
        this.dataSource.data = fichas;
        this.isLoading = false;
      });
  }

  public displayLote(lote: LoteModel): string {
    return lote && lote.codigo_lote ? `${lote.codigo_lote}` : '';
  }
}
