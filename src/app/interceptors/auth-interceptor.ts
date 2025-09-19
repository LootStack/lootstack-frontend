import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o serviço de autenticação
  const authService = inject(Auth);
  // Pega o token
  const authToken = authService.getToken();

  // Verifica se o token existe
  if (authToken) {
    // Se o token existe, clona a requisição original e adiciona o novo cabeçalho
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    // Envia a requisição clonada e com o cabeçalho
    return next(authReq);
  }

  // Se não houver token, simplesmente envia a requisição original sem modificação
  return next(req);
};
