import { Injectable, signal } from '@angular/core';
import { SessionUser, ToastConfig, User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  themeColorMode = signal<string>('sun');
  user = signal<SessionUser>({
    token: '',
    currentUser: {
      firstname: '',
      lastname: '',
      address2: '',
      phonenumber: '',
      userid: '',
      accountid: 0,
      id: 0,
      address1: '',
      emailid: '',
      role: 0,
      password: ''
    },
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
