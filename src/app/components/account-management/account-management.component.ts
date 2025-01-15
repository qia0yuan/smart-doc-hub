import { Component, effect, Signal, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from '../user-management/profile/profile.component';
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Account } from '../../models/models';
import { BehaviorSubject, catchError, of, switchMap, tap, throwError } from 'rxjs';

@Component({
    selector: 'app-account-management',
    imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
    templateUrl: './account-management.component.html',
    styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent {
    accounts!: Signal<Account | undefined>;
    selectedUsers!: any;
    action = signal<string>('');
    refreshTable$ = new BehaviorSubject<void>(undefined);

    constructor(
        private userService: UserService,
        private apiService: ServiceCallsService
    ) {
        const accountId = this.userService.user().currentUser?.accountid;
        this.accounts = toSignal<Account>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap(() =>
                    this.apiService.getAccountByAccountId(accountId).pipe(
                        catchError((err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Service call failed',
                            }));
                            return of();
                        })
                    )
                )
            )
        );
        effect(() => {
            if (this.accounts()) {
                this.userService.showSpinner.set(false);
            }
        });
    }

    ngOnInit() {}

    profileAction(action: string) {
        this.action.set(action);
    }

    onDelete() {}
}
