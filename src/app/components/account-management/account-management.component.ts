import { Component, Signal, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from "../user-management/profile/profile.component";
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-management',
  imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss'
})
export class AccountManagementComponent {
  accounts!: Signal<any[] | undefined>;
  selectedUsers!: any;
  action = signal<string>('');

  constructor(private userService: UserService, private apiService: ServiceCallsService) {
    const accountId = this.userService.user().currentUser.accountid;
    this.accounts = toSignal<any[]>(this.apiService.getAccountByAccountId(accountId));
  }

  ngOnInit() {
  }

  profileAction(action: string) {
    this.action.set(action);
  }

  onDelete() {
      this.userService.confirmDialog.set(true);
  }
}
