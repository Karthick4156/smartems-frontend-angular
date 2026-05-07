import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();
  // ✅ Attach Token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(

    catchError((error) => {

      // ✅ Handle Unauthorized (401)
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        router.navigate(['auth/login']);
      }

      return throwError(() => error);
    })

  );
};