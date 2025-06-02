import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authentification/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Ignorer les endpoints d'authentification
  const authEndpoints = ['/api/auth/login/', '/api/auth/register/'];
  const isAuthRequest = authEndpoints.some(endpoint => req.url.includes(endpoint));

  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};