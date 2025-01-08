import { Component, Signal, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from "./profile/profile.component";
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/models';

@Component({
  selector: 'app-user-management',
  imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: Signal<User[] | undefined>;
  selectedUsers!: User;
  action = signal<string>('');

  constructor(private userService: UserService, private apiService: ServiceCallsService) {
    const accountId = this.userService.user().currentUser.accountid,
    userId = this.userService.user().currentUser.userid;
    this.users = toSignal<User[]>(this.apiService.getUserlist(accountId, userId));
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
