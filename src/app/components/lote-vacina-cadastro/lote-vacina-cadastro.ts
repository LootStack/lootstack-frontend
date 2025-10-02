import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { Vacina } from '../../services/vacina';
import { LoteVacina } from '../../services/lote-vacina';
import { VacinaModel } from '../../models/vacina.models';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-lote-vacina-cadastro',
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatIconModule,
    MatDialogModule, Confirmacao, MatAutocompleteModule, NgxMaskDirective
  ],
  templateUrl: './lote-vacina-cadastro.html',
  styleUrl: './lote-vacina-cadastro.scss'
})
export class LoteVacinaCadastro implements OnInit {
  public loteVacinaForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  private todasVacinas: VacinaModel[] = [];
  public vacinasFiltradas$!: Observable<VacinaModel[]>;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private vacinaService: Vacina, private loteVacinaService: LoteVacina) {
    this.loteVacinaForm = this.fb.group({
      id_vacina: new FormControl<string | VacinaModel>('', Validators.required),
      codigo_lote_vacina: ['', [Validators.required, Validators.minLength(3)]],
      data_validade: [null, Validators.required],
      doses_total_ml: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.carregarVacinas();
  }

  private carregarVacinas(): void {
    this.isLoading = true;
    this.vacinaService.getVacinas('').subscribe({
      next: (vacinas) => {
        this.todasVacinas = vacinas;
        this.vacinasFiltradas$ = this.loteVacinaForm.get('id_vacina')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nome;
            return name ? this.filterVacinas(name) : this.todasVacinas.slice();
          })
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de vacinas.';
        this.isLoading = false;
      }
    });
  }

  private filterVacinas(value: string): VacinaModel[] {
    const filterValue = value.toLowerCase();
    return this.todasVacinas.filter(vacina => vacina.nome.toLowerCase().includes(filterValue));
  }

  public displayVacina(vacina: VacinaModel): string {
    return vacina && vacina.nome ? vacina.nome : '';
  }

  public onSubmit(): void {
    if (this.loteVacinaForm.invalid) {
      this.loteVacinaForm.markAllAsTouched();
      return;
    }

    const vacinaSelecionada = this.loteVacinaForm.get('id_vacina')?.value as VacinaModel;
    if (typeof vacinaSelecionada !== 'object' || !vacinaSelecionada.id_vacina) {
      this.errorMessage = "Por favor, selecione uma vacina válida da lista.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.loteVacinaForm.value;

    const dataString = formValues.data_validade as string;
    const [dia, mes, ano] = dataString.split('/');
    const dataFormatadaParaApi = `${ano}-${mes}-${dia}`;

    const dadosParaApi = {
      ...formValues,
      id_vacina: vacinaSelecionada.id_vacina,
      data_validade: dataFormatadaParaApi
    };

    this.loteVacinaService.createLote(dadosParaApi).subscribe({
      next: loteCriado => {
        this.isLoading = false;
        const dialogRef = this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: `Lote "${loteCriado.codigo_lote_vacina}" criado com sucesso!`
          }
        });
        dialogRef.afterClosed().subscribe(() => this.loteVacinaForm.reset());
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.message;
      }
    });
  }

  public returnPageConsulta(): void {
    this.router.navigate(['/dashboard/admin/lotes-vacinas']);
  }
}
