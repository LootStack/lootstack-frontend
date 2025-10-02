import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { MatDialog } from '@angular/material/dialog';
import { Confirmacao } from '../dialogs/confirmacao/confirmacao';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if(!authService.isLoggedIn()){
    return router.parseUrl('/login');
  }

  if(authService.isAdmin()){
    return true;
  } else {
    const dialogRef = dialog.open(Confirmacao, {
      data: {
        titulo: 'Acesso Negado',
        mensagem: 'Esta área é exclusiva para administradores',
        mostrarBotaoCancelar: false
      }
    });

    return dialogRef.afterClosed().pipe(
      map(() => router.parseUrl('/dashboard'))
    );
  }
};
