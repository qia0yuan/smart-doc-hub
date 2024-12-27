import { Component, effect, input, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-profile',
  imports: [ButtonModule, Dialog, InputTextModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  action = input<string>('');
  closed = output();
  visible = false;

  constructor() {
    effect(() => {
      this.visible = this.action() ? true : false;
    });
  }

  onBtnClick(action: string) {
    this.closed.emit();
    this.visible = false;
  }
}
