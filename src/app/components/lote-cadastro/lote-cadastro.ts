import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Lote } from '../../services/lote';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';

@Component({
  selector: 'app-lote-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    Confirmacao
  ],
  templateUrl: './lote-cadastro.html',
  styleUrl: './lote-cadastro.scss'
})
export class LoteCadastro {
  public codigoLoteForm!: number;
  public loteForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(private loteService: Lote, private router: Router, private fb: FormBuilder, private dialog: MatDialog) {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoje.getDate().toString().padStart(2, '0');

    const dataHoje = `${ano}-${mes}-${dia}`;

    this.loteForm = this.fb.group({
      codigo_lote: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      data_criacao: [dataHoje, Validators.required]
    });
  }

  public onSubmit(): void {
    if (this.loteForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.loteForm.value;

    const dadosParaApi = {
      ...formValues,
      data_criacao: formValues.data_criacao
    };

    this.loteService.createLote(dadosParaApi).subscribe({
      next: loteCriado => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: `Lote "${loteCriado.codigo_lote}" criado com sucesso!`
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.loteForm.reset();

          const hoje = new Date();
          const ano = hoje.getFullYear();
          const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
          const dia = hoje.getDate().toString().padStart(2, '0');
          const dataHoje = `${ano}-${mes}-${dia}`;

          this.loteForm.patchValue({ data_criacao: dataHoje });
        });
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.message;
        console.error(err);
      }
    })
  }

  public returnPageConsulta(): void {
    this.router.navigate(['/dashboard/lotes']);
  }
}
