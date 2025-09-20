import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FichaListModel } from '../../models/ficha.models';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import { Ficha } from '../../services/ficha';

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
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './ficha-consulta-total.html',
  styleUrl: './ficha-consulta-total.scss'
})
export class FichaConsultaTotal {
  public searchControl: FormControl = new FormControl('');

  public dataSource: MatTableDataSource<FichaListModel> = new MatTableDataSource<FichaListModel>();
  
  public displayedColumns: string[] = ['id_porca', 'data_nascimento', 'codigo_lote'];

  public isLoading:boolean = false;
  public errorMessage: string | null = null;

  constructor(private fichaService: Ficha) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          this.errorMessage = null;
        }),
        switchMap((term) =>
          this.fichaService.getFichas(term || '').pipe(
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
