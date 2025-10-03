import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { Ficha } from '../../services/ficha';
import { Aplicacao } from '../../services/aplicacao';
import { Auth } from '../../services/auth';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { LoteVacina } from '../../services/lote-vacina';
import { FichaListModel } from '../../models/ficha.models';
import { LoteVacinaModel } from '../../models/loteVacina.models';
import { AplicacaoPayload } from '../../models/aplicacao.models';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-aplicacao-registro',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, AsyncPipe, NgxMaskDirective,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatAutocompleteModule, MatProgressSpinnerModule, MatDialogModule, MatChipsModule
  ],
  templateUrl: './aplicacao-registro.html',
  styleUrl: './aplicacao-registro.scss'
})
export class AplicacaoRegistro implements OnInit {
  public aplicacaoForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  public porcasSelecionadas: FichaListModel[] = [];
  public porcaCtrl = new FormControl('');
  public fichasFiltradas$!: Observable<FichaListModel[]>;
  private todasAsFichas: FichaListModel[] = [];
  @ViewChild('porcaInput') porcaInput!: ElementRef<HTMLInputElement>;

  public loteVacinaCtrl = new FormControl<string | LoteVacinaModel>('', Validators.required);
  public lotesVacinaFiltrados$!: Observable<LoteVacinaModel[]>;

  constructor(private fb: FormBuilder, private fichaService: Ficha, private aplicacaoService: Aplicacao, private loteVacinaService: LoteVacina, public authService: Auth, private dialog: MatDialog) {
    this.aplicacaoForm = this.fb.group({
      dose_aplicada_ml: ['', [Validators.required, Validators.min(0.1)]],
      data_aplicacao: [this.formatarParaInput(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarFichasParaAutocomplete();
    this.setupAutocompleteLotes();
  }

  private carregarFichasParaAutocomplete(): void {
    this.fichaService.getFichas('', '').subscribe(fichas => {
      this.todasAsFichas = fichas;
      this.fichasFiltradas$ = this.porcaCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : ''; 
          return name ? this.filterFichas(name) : this.todasAsFichas.slice();
        })
      );
    });
  }

  private setupAutocompleteLotes(): void {
    this.lotesVacinaFiltrados$ = this.loteVacinaCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const termo = typeof value === 'string' ? value : '';
        return this.loteVacinaService.getLotes(termo);
      })
    );
  }

  private filterFichas(value: string): FichaListModel[] {
    const filterValue = value.toLowerCase();
    return this.todasAsFichas.filter(ficha => ficha.id_porca.toLowerCase().includes(filterValue));
  }

  public removerPorca(porca: FichaListModel): void {
    const index = this.porcasSelecionadas.indexOf(porca);
    if (index >= 0) {
      this.porcasSelecionadas.splice(index, 1);
    }
  }

  public porcaSelecionada(event: MatAutocompleteSelectedEvent): void {
    const ficha = event.option.value;
    if (!this.porcasSelecionadas.find(p => p.id_porca === ficha.id_porca)) {
      this.porcasSelecionadas.push(ficha);
    }
    this.porcaInput.nativeElement.value = '';
    this.porcaCtrl.setValue(null);
  }

  public displayLoteVacina(lote: LoteVacinaModel): string {
    return lote ? `${lote.codigo_lote_vacina} - ${lote.nome_vacina}` : '';
  }

  public onSubmit(): void {
    const loteSelecionado = this.loteVacinaCtrl.value as LoteVacinaModel;

    if (this.aplicacaoForm.invalid || this.porcasSelecionadas.length === 0 || typeof loteSelecionado !== 'object') {
      this.errorMessage = "Verifique os campos. É necessário selecionar ao menos uma porca e um lote de vacina válido";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.aplicacaoForm.value;
    const [dia, mes, ano] = formValues.data_aplicacao.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const dadosParaApi: AplicacaoPayload = {
      ids_porcas: this.porcasSelecionadas.map(p => p.id_porca),
      id_lote_vacina: loteSelecionado.id_lote_vacina,
      dose_aplicada_ml: formValues.dose_aplicada_ml,
      data_aplicacao: dataFormatada
    };

    this.aplicacaoService.registrarAplicacao(dadosParaApi).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialog.open(Confirmacao, { data: { titulo: 'Sucesso!', mensagem: response.message } })
          .afterClosed().subscribe(() => {
            this.aplicacaoForm.reset({ data_aplicacao: this.formatarParaInput(new Date()) });
            this.loteVacinaCtrl.reset();
            this.porcasSelecionadas = [];
          });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ocorreu um erro desconhecido';
      }
    });
  }

  private formatarParaInput(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
