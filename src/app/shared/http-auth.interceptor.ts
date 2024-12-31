import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const httpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserService).userDetails().token;
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(modifiedReq);
  }
  return next(req);
};
