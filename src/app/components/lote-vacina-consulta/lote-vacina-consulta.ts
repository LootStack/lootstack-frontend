import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { Auth } from '../../services/auth';
import { LoteVacina } from '../../services/lote-vacina';
import { LoteVacinaModel } from '../../models/loteVacina.models';

@Component({
  selector: 'app-lote-vacina-consulta',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, DatePipe,
    MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatProgressSpinnerModule, MatButtonModule, MatDialogModule, Confirmacao
  ],
  templateUrl: './lote-vacina-consulta.html',
  styleUrl: './lote-vacina-consulta.scss'
})
export class LoteVacinaConsulta implements OnInit {
  public lotesVacina: LoteVacinaModel[] = [];
  public colunasExibidas: string[] = ['codigo_lote_vacina', 'nome_vacina', 'data_validade', 'acoes'];
  public searchControl: FormControl = new FormControl('');
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private loteVacinaService: LoteVacina, public authService: Auth, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        this.error = null;
        return this.loteVacinaService.getLotes(term || '');
      })
    ).subscribe({
      next: data => {
        this.lotesVacina = data;
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message;
        this.isLoading = false;
        this.lotesVacina = [];
      }
    });
  }

  public onDeleteLote(lote: LoteVacinaModel): void {
    const idToDelete = lote.id_lote_vacina;

    const dialogRef = this.dialog.open(Confirmacao, {
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja remover o lote "${lote.codigo_lote_vacina}" da vacina "${lote.nome_vacina}"?`,
        mostrarBotaoCancelar: true
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loteVacinaService.deleteLote(idToDelete).subscribe({
          next: () => {
            this.lotesVacina = this.lotesVacina.filter(lv => lv.id_lote_vacina !== idToDelete);
            this.dialog.open(Confirmacao, {
              data: {
                titulo: 'Sucesso!',
                mensagem: 'Lote de vacina removido com sucesso'
              },
            });
          },
          error: err => {
            this.dialog.open(Confirmacao, {
              data: {
                titulo: 'Falha na Remoção',
                mensagem: `Falha ao remover lote: ${err.message}`
              },
            });
          }
        });
      }
    });
  }
}
