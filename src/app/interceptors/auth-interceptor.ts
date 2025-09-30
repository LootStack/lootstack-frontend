import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  const token = authService.getToken();

  // Se houver token e ele não tiver expirado, adiciona header
  let outgoing = req;
  if (token && !authService.isTokenExpired()) {
    outgoing = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  // Se o token existir mas expirou, desloga e redireciona imediatamente
  if (token && authService.isTokenExpired()) {
    authService.logout();
    // interrompe a requisição retornando erro (opcional).
    return next(req).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // Envia a requisição (com ou sem header) e trata erros 401/403
  return next(outgoing).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          console.warn('Autenticação falhou no interceptor:', err.error?.message ?? err.message);
          authService.logout();
        }
      }
      return throwError(() => err);
    })
  );
};
