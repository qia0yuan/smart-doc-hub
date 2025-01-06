import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from "./profile/profile.component";
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: any[];
  selectedUsers!: any;
  action = signal<string>('');

  constructor(private userService: UserService, private apiService: ServiceCallsService) {}

  ngOnInit() {
    const accountId = this.userService.user().accountId;
    this.apiService.getAccountByAccountId(accountId).subscribe((data: any) => {
      if (data) {
        this.users = data;
      }
    });
  }

  profileAction(action: string) {
    this.action.set(action);
  }

  onDelete() {
      this.userService.confirmDialog.set(true);
  }
}
