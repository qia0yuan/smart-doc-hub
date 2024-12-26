import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-management',
  imports: [TableModule, ButtonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: any[];
  selectedUsers!: any;

  ngOnInit() {
      this.users = [
          {
              id: '1000',
              name: 'George',
              description: 'Account of George.',
              group: 'Retail',
              date: '08/01/2021',
          },
          {
              id: '1001',
              name: 'Venky',
              description: 'Account of Venky.',
              group: 'Retail',
              date: '09/01/2021',
          },
          {
              id: '1002',
              name: 'Rahul',
              description: 'Account of Rahul.',
              group: 'ERMS+',
              date: '09/01/2021',
          },
      ];
  }
}
