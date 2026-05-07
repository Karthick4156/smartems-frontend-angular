import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const role = authService.getRole();

  if (isLoggedIn) {

    // ✅ Redirect based on role
    const routeMap: any = {
      Admin: '/admin/dashboard',
      Employee: '/employee/dashboard'
    };

    router.navigate([routeMap[role!] || '/']);
    return false;
  }

  return true;
};