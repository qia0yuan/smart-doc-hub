import { Component, DestroyRef, effect, Signal, signal, untracked } from '@angular/core';
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
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';

@Component({
    selector: 'app-user-management',
    imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
    users!: Signal<User[] | undefined>;
    selectedUsers!: User;
    action = signal<string>('');
    refreshTable$ = new BehaviorSubject<void>(undefined);

    constructor(
        private userService: UserService,
        private apiService: ServiceCallsService,
        private destroyRef: DestroyRef
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

    onDelete() {}
}
