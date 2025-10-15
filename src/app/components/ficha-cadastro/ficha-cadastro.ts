import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Ficha } from '../../services/ficha';
import { LoteModel } from '../../models/lote.models';
import { Lote } from '../../services/lote';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Confirmacao } from '../../dialogs/confirmacao/confirmacao';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-ficha-cadastro',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatProgressSpinnerModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatDialogModule, Confirmacao,
    MatAutocompleteModule
  ],
  templateUrl: './ficha-cadastro.html',
  styleUrl: './ficha-cadastro.scss'
})
export class FichaCadastro implements OnInit {
  public fichaForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public tiposPorca: string[] = ['Marrã', 'Lactação', 'Pré-Parto', 'Gestação', 'Reposição', 'Creche'];

  private todosLotes: LoteModel[] = [];
  public lotesFiltrados$!: Observable<LoteModel[]>;

  public isEditMode: boolean = false;
  private currentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private fichaService: Ficha,
    private router: Router,
    private route: ActivatedRoute,
    private loteService: Lote,
    private dialog: MatDialog
  ) {
    this.fichaForm = this.fb.group({
      id_porca: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: [new Date(), Validators.required],
      tipo_porca: ['', Validators.required],
      id_lote: new FormControl<string | LoteModel>('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.carregarLotes();
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentId = id;
        this.fichaForm.get('id_porca')?.disable();

        this.isLoading = true;
        this.fichaService.getFichaById(id).subscribe(ficha => {
          this.fichaForm.patchValue({
            id_porca: ficha.id_porca,
            data_nascimento: new Date(ficha.data_nascimento.replace(/-/g, '/')),
            tipo_porca: ficha.tipo_porca,
            id_lote: ficha.lote
          });
          this.isLoading = false;
        });
      }
    });
  }

  private carregarLotes(): void {
    this.isLoading = true;
    this.loteService.getLotes('').subscribe({
      next: (lotesDisponiveis) => {
        this.todosLotes = lotesDisponiveis;
        this.isLoading = false;
        this.lotesFiltrados$ = this.fichaForm.get('id_lote')!.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.codigo_lote;
            return name ? this.filterLotes(String(name)) : this.todosLotes.slice();
          }),
        );
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  private filterLotes(value: string): LoteModel[] {
    const filterValue = value.toLowerCase();
    return this.todosLotes.filter(lote =>
      String(lote.codigo_lote).toLowerCase().includes(filterValue)
    );
  }

  public displayLote(lote: LoteModel): string {
    return lote && lote.codigo_lote ? `${lote.codigo_lote}` : '';
  }

  public onSubmit(): void {
    if (this.fichaForm.invalid) {
      this.fichaForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValues = this.fichaForm.getRawValue();
    const loteSelecionado = formValues.id_lote as LoteModel;

    if (typeof loteSelecionado !== 'object' || !loteSelecionado.id_lote) {
      this.errorMessage = "Por favor, selecione um lote válido da lista.";
      this.isLoading = false;
      return;
    }

    const dadosParaApi = {
      id_porca: formValues.id_porca,
      id_lote: loteSelecionado.id_lote,
      data_nascimento: this.formatarData(formValues.data_nascimento),
      tipo_porca: formValues.tipo_porca,
    };

    const action$ = this.isEditMode
      ? this.fichaService.updateFicha(this.currentId!, dadosParaApi)
      : this.fichaService.createFicha(dadosParaApi);

    action$.subscribe({
      next: (ficha) => {
        this.isLoading = false;
        this.dialog.open(Confirmacao, {
          data: {
            titulo: 'Sucesso!',
            mensagem: `Ficha para a porca "${ficha.id_porca}" ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`
          }
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/dashboard/fichas']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Ocorreu um erro desconhecido';
        console.error('Erro ao salvar ficha:', err);
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
