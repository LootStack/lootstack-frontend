import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../models/dialogData.models';

@Component({
  selector: 'app-confirmacao',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirmacao.html',
  styleUrl: './confirmacao.scss'
})
export class Confirmacao {
  constructor(
    public dialogRef: MatDialogRef<Confirmacao>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  public onCancelarClick(): void {
    this.dialogRef.close(false);
  }

  public onConfirmarClick(): void {
    this.dialogRef.close(true);
  }
}
