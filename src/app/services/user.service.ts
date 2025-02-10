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
      password: '',
      subscriptiontype: '',
    },
  });
  selectedUser = signal<User>({
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
    password: '',
    subscriptiontype: '',
  });
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
