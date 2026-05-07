import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const userRole = authService.getRole();

  // ✅ Support multiple roles
  const expectedRoles: string[] = route.data?.['role'];

  if (!userRole || !expectedRoles?.includes(userRole)) {
    router.navigate(['/unauthorized']); // better UX
    return false;
  }

  return true;
};