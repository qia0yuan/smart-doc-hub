import { Component, effect, input, output, signal } from '@angular/core';
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
  visible = signal<boolean>(false);
  closeIconClicked = effect(() => {
    !this.visible() && this.closed.emit();
  });

  constructor() {
    effect(() => {
      this.visible.set(this.action() ? true : false);
    });
  }

  onBtnClick(action: string) {
    this.closed.emit();
    this.visible.set(false);
  }
}
