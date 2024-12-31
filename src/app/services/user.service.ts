import { Injectable, signal } from '@angular/core';
import { ToastConfig, User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  themeColorMode = signal<string>('sun');
  userDetails = signal<User>({
    token: '',
  });
  confirmDialog = signal<boolean>(false);
  openToast = signal<ToastConfig>({});
  showSpinner = signal<boolean>(false);

  constructor() { }

  setThemeBackground() {
    const root = document.querySelector('html');
    root?.classList.toggle('dark-mode', this.themeColorMode() === 'moon');
  }

  getCurrentThemeBackground() {
    const root = document.querySelector('html');
    return root?.classList.contains('dark-mode') ? 'moon' : 'sun';
  }

}
