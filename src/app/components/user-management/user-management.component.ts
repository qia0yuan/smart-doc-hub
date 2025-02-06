import {
    Component,
    DestroyRef,
    effect,
    Signal,
    signal,
    untracked,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/models';
import {
    BehaviorSubject,
    catchError,
    forkJoin,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-user-management',
    imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
    users!: Signal<User[] | undefined>;
    selectedUsers = signal<User[]>([]);
    action = signal<string>('');
    refreshTable$ = new BehaviorSubject<void>(undefined);

    constructor(
        private userService: UserService,
        private apiService: ServiceCallsService,
        private destroyRef: DestroyRef,
        private confirmationService: ConfirmationService
    ) {
        const accountId = this.userService.user().currentUser?.accountid;
        this.users = toSignal<User[]>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap(() =>
                    this.apiService.getUserlist(accountId).pipe(
                        catchError((err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Service call failed',
                            }));
                            return of([]);
                        }),
                        takeUntilDestroyed(this.destroyRef)
                    )
                )
            )
        );
        effect(() => {
            this.users() &&
                untracked(() => {
                    this.userService.showSpinner.set(false);
                });
        });
    }

    ngOnInit() {}

    profileAction(action: string) {
        this.action.set(action);
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

    onDelete(rows: User[]) {
        const selectedUsers = rows.map((user) =>
                this.apiService.deleteUsers(user.id)
            ),
            callback = () => {
                this.userService.showSpinner.set(true);
                forkJoin(selectedUsers)
                    .pipe(catchError((err) => throwError(() => err)))
                    .subscribe({
                        next: (res) => {
                            this.userService.openToast.update(() => ({
                                type: 'Success',
                                message: 'User(s) deleted successfully',
                            }));
                            this.selectedUsers.set([]);
                            this.refreshTable$.next();
                        },
                        error: (err) => {
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Failed to delete user(s)',
                            }));
                            this.selectedUsers.set([]);
                            this.userService.showSpinner.set(false);
                        },
                    });
            };
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select user(s)',
            }));
        } else {
            this.confirm(callback);
        }
    }
}
