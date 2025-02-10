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
import { ProfileComponent } from '../user-management/profile/profile.component';
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
    selector: 'app-invitee-management',
    imports: [TableModule, ButtonModule, ProfileComponent, CommonModule],
    templateUrl: './invitee-management.component.html',
    styleUrl: './invitee-management.component.scss',
})
export class InviteeManagementComponent {
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
                    this.apiService.getInviteelist(accountId).pipe(
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

    profileAction(action: string) {
        this.action.set(action);
        if (action === 'Update') {
            this.userService.selectedUser.update((user) => ({
                ...user,
                firstname: this.selectedUsers()[0].firstname,
                lastname: this.selectedUsers()[0].lastname,
                emailid: this.selectedUsers()[0].emailid,
                address2: this.selectedUsers()[0].address2,
                phonenumber: this.selectedUsers()[0].phonenumber,
                userid: this.selectedUsers()[0].userid,
                accountid: this.selectedUsers()[0].accountid,
                id: this.selectedUsers()[0].id,
                address1: this.selectedUsers()[0].address1,
                role: this.selectedUsers()[0].role,
                password: this.selectedUsers()[0].password,
                subscriptiontype: this.selectedUsers()[0].subscriptiontype,
            }));
        } else {
            this.userService.selectedUser.set({} as User);
        }
    }

    onInvite(rows: User[]) {
        const inviteObj = {
                id: this.userService.user().currentUser?.id,
                requestedby: this.userService.user().currentUser?.id,
                approvalflag: null,
                description: '',
                expireflag: '',
                createdby: 1,
                updatedby: 1,
                invitationusers: rows.map((user) => ({
                    id: null,
                    invitationrequestid: null,
                    userid: user.id,
                    userFirstName: user.firstname,
                    userLastName: user.lastname,
                    token: this.userService.user().token,
                    status: '',
                    shareddocuments: null,
                })),
            },
            callback = () => {
                this.userService.showSpinner.set(true);
                this.apiService.sendInvitation(inviteObj).subscribe({
                    next: (resp) => {
                        this.userService.openToast.update(() => ({
                            type: 'Success',
                            message: 'Invitation(s) sent',
                        }));
                        this.selectedUsers.set([]);
                        this.userService.showSpinner.set(false);
                    },
                    error: (err) => {
                        this.userService.showSpinner.set(false);
                        this.userService.openToast.update(() => ({
                            type: 'Error',
                            message: 'Invitation failed',
                        }));
                    },
                });
            };
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select invitee(s)',
            }));
        } else {
            this.confirm(callback);
        }
    }

    onDelete(rows: any) {
        const selectedUsers = rows.map((user: User) => this.apiService.deleteInvitees(user.id)),
        callback = () => {
            this.userService.showSpinner.set(true);
            forkJoin(selectedUsers)
            .pipe(catchError((err) => throwError(() => err)))
            .subscribe({
                next: (resp) => {
                    this.userService.openToast.update(() => ({
                        type: 'Success',
                        message: 'Invitee(s) deleted successfully',
                    }));
                    this.selectedUsers.set([]);
                    this.refreshTable$.next();
                },
                error: (err) => {
                    this.userService.showSpinner.set(false);
                    this.userService.openToast.update(() => ({
                        type: 'Error',
                        message: 'Failed to delete invitee(s)',
                    }));
                    this.selectedUsers.set([]);
                    this.userService.showSpinner.set(false);
                },
            });
        };
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select invitee(s)',
            }));
        } else {
            this.confirm(callback);
        }
    }
}
