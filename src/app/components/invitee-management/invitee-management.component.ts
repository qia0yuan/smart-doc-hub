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
        const callback = () => {
            this.userService.showSpinner.set(true);
            this.apiService.deleteDocument(rows[0].document_id).subscribe({
                next: (resp) => {
                    this.userService.openToast.update(() => ({
                        type: 'Success',
                        message: 'Invitee(s) Deleted',
                    }));
                    this.refreshTable$.next();
                },
                error: (err) => {
                    this.userService.showSpinner.set(false);
                    this.userService.openToast.update(() => ({
                        type: 'Error',
                        message: 'Deletion failed',
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
}
