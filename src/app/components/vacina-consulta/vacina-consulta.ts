import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { Vacina } from '../../services/vacina';
import { VacinaModel } from '../../models/vacina.models';

@Component({
  selector: 'app-vacina-consulta',
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule,
    RouterModule, MatDialogModule, Confirmacao
  ],
  templateUrl: './vacina-consulta.html',
  styleUrl: './vacina-consulta.scss'
})
export class VacinaConsulta implements OnInit {
  public vacinas: VacinaModel[] = [];
  public colunasExibidas: string[] = ['nome', 'acoes'];
  public searchControl: FormControl = new FormControl('');
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private vacinaService: Vacina, public authService: Auth, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;
        this.error = null;
        return this.vacinaService.getVacinas(term || '');
      })
    ).subscribe({
      next: data => {
        this.vacinas = data;
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message;
        this.isLoading = false;
        this.vacinas = [];
      }
    });
  }

  public onDeleteVacina(vacina: VacinaModel): void {
    const idToDelete = vacina.id_vacina;

    const dialogRef = this.dialog.open(Confirmacao, {
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja remover a vacina "${vacina.nome}"? Esta ação é irreversível!`,
        mostrarBotaoCancelar: true
      },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.vacinaService.deleteVacina(idToDelete).subscribe({
          next: () => {
            this.vacinas = this.vacinas.filter(v => v.id_vacina !== idToDelete);
            this.dialog.open(Confirmacao, {
              data: {
                titulo: 'Sucesso!',
                mensagem: 'Vacina removida com sucesso'
              },
            });
          },
          error: err => {
            this.dialog.open(Confirmacao, {
              data: {
                titulo: 'Falha na Remoção',
                mensagem: `Falha ao remover vacina: ${err.message}`
              },
            });
          }
        });
      }
    });
  }
}
