import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const httpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserService).userDetails().token,
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  return next(modifiedReq);
};
