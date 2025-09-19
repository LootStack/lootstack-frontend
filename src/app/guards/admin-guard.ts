import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if(!authService.isLoggedIn){
    return router.parseUrl('/login');
  }

  if(authService.isAdmin()){
    return true;
  } else {
    alert('Acesso negado. Esta área é exclusiva para administradores');
    return router.parseUrl('/dashboard');
  }
};
