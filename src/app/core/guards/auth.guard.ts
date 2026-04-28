import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkAuth();

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};