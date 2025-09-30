import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Ficha } from '../../services/ficha';
import { FichaListModel } from '../../models/ficha.models';
import { Aplicacao } from '../../services/aplicacao';
import { Auth } from '../../services/auth';
import { Usuario } from '../../models/usuario.models';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { AplicacaoPayload } from '../../models/aplicacao.models';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-aplicacao-registro',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, AsyncPipe,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatDialogModule
  ],
  templateUrl: './aplicacao-registro.html',
  styleUrl: './aplicacao-registro.scss'
})
export class AplicacaoRegistro implements OnInit {
  public aplicacaoForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public usuarioLogado: Usuario | null;

  private todasAsFichas: FichaListModel[] = [];
  public fichasFiltradas$!: Observable<FichaListModel[]>;

  constructor(private fb: FormBuilder, private fichaService: Ficha, private aplicacaoService: Aplicacao, private authService: Auth, private dialog: MatDialog, private router: Router) {
    this.usuarioLogado = this.authService.getDecoddedToken();

    this.aplicacaoForm = this.fb.group({
      id_porca: new FormControl<string | FichaListModel>('', Validators.required),
      nome: ['', [Validators.required, Validators.minLength(3)]],
      lote_vacina: ['', [Validators.required, Validators.minLength(3)]],
      data_validade: [new Date(), Validators.required],
      doses_total_ml: ['', [Validators.required, Validators.min(0.1)]],
      dose_aplicada_ml: ['', [Validators.required, Validators.min(0.1)]],
      data_aplicacao: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarFichas();
  }

  private carregarFichas(): void {
    this.isLoading = true;
    this.fichaService.getFichas('', '').subscribe({
      next: (fichas) => {
        this.todasAsFichas = fichas;
        this.fichasFiltradas$ = this.aplicacaoForm.get('id_porca')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            const id = typeof value === 'string' ? value : value?.id_porca;
            return id ? this.filterFichas(id) : this.todasAsFichas.slice();
          })
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de porcas. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private filterFichas(value: string): FichaListModel[] {
    const filterValue = value.toLowerCase();
    return this.todasAsFichas.filter(ficha =>
      ficha.id_porca.toLowerCase().includes(filterValue)
    );
  }

  public displayFicha(ficha: FichaListModel): string {
    return ficha && ficha.id_porca ? ficha.id_porca : '';
  }

  public onSubmit(): void {
    if (this.aplicacaoForm.invalid) {
      this.aplicacaoForm.markAllAsTouched();
      return;
    }

    const fichaSelecionada = this.aplicacaoForm.get('id_porca')?.value as FichaListModel;
    if (typeof fichaSelecionada !== 'object' || !fichaSelecionada.id_porca) {
      this.errorMessage = "Por favor, selecione uma porca válida da lista.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.aplicacaoForm.value;

    const dadosParaApi: AplicacaoPayload = {
      id_porca: fichaSelecionada.id_porca,
      nome: formValues.nome,
      lote_vacina: formValues.lote_vacina,
      doses_total_ml: formValues.doses_total_ml,
      dose_aplicada_ml: formValues.dose_aplicada_ml,
      data_validade: this.formatarData(formValues.data_validade),
      data_aplicacao: this.formatarData(formValues.data_aplicacao)
    };

    if (this.authService.isAdmin() && this.usuarioLogado) {
      dadosParaApi.id_usuario = this.usuarioLogado.id;
    }

    this.aplicacaoService.registrarAplicacao(dadosParaApi).subscribe({
      next: () => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: 'Aplicação de vacina registrada com sucesso!'
          }
        });

        dialogRef.afterClosed().subscribe(() => {
          this.aplicacaoForm.reset({
            data_validade: new Date(),
            data_aplicacao: new Date()
          });
          Object.keys(this.aplicacaoForm.controls).forEach(key => {
            this.aplicacaoForm.get(key)?.setErrors(null);
          });
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ocorreu um erro desconhecido.';
        console.error('Erro ao registrar aplicação:', err);
      }
    });
  }

  private formatarData(data: Date): string {
    if (!data) return '';
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
