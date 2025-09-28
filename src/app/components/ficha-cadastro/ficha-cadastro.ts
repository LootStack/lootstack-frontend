import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Ficha } from '../../services/ficha';
import { LoteModel } from '../../models/lote.models';
import { Lote } from '../../services/lote';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';

@Component({
  selector: 'app-ficha-cadastro',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatDialogModule, Confirmacao
  ],
  templateUrl: './ficha-cadastro.html',
  styleUrl: './ficha-cadastro.scss'
})
export class FichaCadastro implements OnInit {
  public fichaForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public tiposPorca: string[] = ['Matriz', 'Leitoa'];

  public lotes: LoteModel[] = [];

  constructor(
    private fb: FormBuilder,
    private fichaService: Ficha,
    private router: Router,
    private loteService: Lote,
    private dialog: MatDialog
  ) {
    this.fichaForm = this.fb.group({
      id_porca: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: [new Date(), Validators.required],
      tipo_porca: ['', Validators.required],
      id_lote: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarLotes();
  }

  private carregarLotes(): void {
    this.isLoading = true;
    this.loteService.getLotes('').subscribe({
      next: (lotesDisponiveis) => {
        this.lotes = lotesDisponiveis;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  public onSubmit(): void {
    if (this.fichaForm.invalid) {
      this.fichaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.fichaForm.value;
    const dadosParaApi = {
      ...formValues,
      data_nascimento: this.formatarData(formValues.data_nascimento)
    };

    this.fichaService.createFicha(dadosParaApi).subscribe({
      next: (fichaCriada) => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: `Ficha para a porca "${fichaCriada.id_porca}" criada com sucesso!`
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.fichaForm.reset();
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ocorreu um erro desconhecido';
        console.error('Erro ao criar ficha:', err);
      }
    });
  }

  public returnPage(): void {
    this.router.navigate(['/dashboard/fichas']);
  }

  private formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
