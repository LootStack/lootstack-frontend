import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Lote } from '../../services/lote';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
    FormsModule
],
  templateUrl: './lote-cadastro.html',
  styleUrl: './lote-cadastro.scss'
})
export class LoteCadastro {
  public codigoLoteForm!: number;
  public loteForm: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(private loteService:Lote, private router:Router, private fb:FormBuilder){
    this.loteForm = this.fb.group({
      codigo_lote: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      data_criacao: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  public onSubmit():void {
    if(this.loteForm.invalid) {
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
        alert(`Lote "${loteCriado.codigo_lote}" criado com sucesso!`);
        this.codigoLoteForm = 0;
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.message;
        console.error(err);
      }
    })
  }

  public returnPageConsulta():void {
    this.router.navigate(['/dashboard/lotes']);
  }
}
