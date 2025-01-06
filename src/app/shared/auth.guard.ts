import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(UserService).user().token;
  const isAuthenticated = () => {
    if (token) {
      return true;
    }
    return true;
  };
  if (isAuthenticated()) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
};
