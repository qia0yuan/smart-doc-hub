import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  themeColorMode = signal<string>('sun');

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
