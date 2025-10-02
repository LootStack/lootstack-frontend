import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { Vacina } from '../../services/vacina';

@Component({
  selector: 'app-vacina-cadastro',
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatIconModule, MatDialogModule, Confirmacao
  ],
  templateUrl: './vacina-cadastro.html',
  styleUrl: './vacina-cadastro.scss'
})
export class VacinaCadastro {
  public vacinaForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private vacinaService: Vacina, private router: Router, private dialog: MatDialog) {
    this.vacinaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  public onSubmit(): void {
    if (this.vacinaForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.vacinaService.createVacina(this.vacinaForm.value).subscribe({
      next: vacinaCriada => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: `Vacina "${vacinaCriada.nome}" criada com sucesso!`
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.vacinaForm.reset();
        });
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao cadastrar a vacina! Verifique se essa vacina já existe ou tente novamente!';
        console.error(err);
      }
    });
  }

  public returnPageConsulta(): void {
    this.router.navigate(['/dashboard/admin/vacinas']);
  }
}
