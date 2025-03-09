import { Component, effect, Signal, signal, untracked } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from '../user-management/profile/profile.component';
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Account } from '../../models/models';
import {
    BehaviorSubject,
    catchError,
    forkJoin,
    map,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-account-management',
    imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
    templateUrl: './account-management.component.html',
    styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent {
    accounts!: Signal<Account[] | undefined>;
    selectedAccts = signal<Account[]>([]);
    action = signal<string>('');
    refreshTable$ = new BehaviorSubject<void>(undefined);

    constructor(
        private userService: UserService,
        private apiService: ServiceCallsService,
        private confirmationService: ConfirmationService,
    ) {
        const accountId = this.userService.user().currentUser?.accountid;
        this.accounts = toSignal<Account[]>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap(() =>
                    this.apiService.getAccountByAccountId(accountId).pipe(
                        map((data) => [data]),
                        catchError((err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Service call failed',
                            }));
                            return of([]);
                        }),
                        takeUntilDestroyed()
                    )
                )
            )
        );
        effect(() => {
            this.accounts() &&
                untracked(() => {
                    this.userService.showSpinner.set(false);
                });
        });
    }

    ngOnInit() {}

    profileAction(action: string) {
        this.action.set(action);
    }

    onDelete(rows: Account[]) {
        const selectedAccts = rows.map((row) =>
                this.apiService.deleteAccount(row.id)
            ),
            callback = () => {
                this.userService.showSpinner.set(true);
                forkJoin(selectedAccts)
                    .pipe(catchError((err) => throwError(() => err)))
                    .subscribe({
                        next: (resp) => {
                            this.userService.openToast.update(() => ({
                                type: 'Success',
                                message: 'File(s) Deleted successfully',
                            }));
                            this.selectedAccts.set([]);
                            this.refreshTable$.next();
                        },
                        error: (err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Failed to delete file(s)',
                            }));
                            this.selectedAccts.set([]);
                        },
                    });
            };
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select file(s)',
            }));
        } else {
            this.confirm(callback);
        }
    }

    confirm(cb: () => void) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to proceed.',
            accept: cb,
            reject: () => {
                // this.userService.openToast.update(() => ({
                //     type: 'info',
                //     message: 'You have rejected',
                // }));
            },
        });
    }
}
