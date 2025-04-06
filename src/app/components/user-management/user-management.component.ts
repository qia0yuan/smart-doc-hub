import {
    Component,
    DestroyRef,
    effect,
    Signal,
    signal,
    untracked,
    WritableSignal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { User, UserSearch } from '../../models/models';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    forkJoin,
    map,
    of,
    Subject,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { USER_FILTER } from '../../constants/common.constant';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-management',
    imports: [
        TableModule,
        ButtonModule,
        ProfileComponent,
        CommonModule,
        PaginatorModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        IftaLabelModule,
        FormsModule,
    ],
    templateUrl: './user-management.component.html',
    styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
    users!: Signal<User[] | undefined>;
    selectedUsers = signal<User[]>([]);
    action = signal<string>('');
    refreshTable$: BehaviorSubject<UserSearch> =
        new BehaviorSubject<UserSearch>({} as UserSearch);
    startItem = signal<number>(0);
    endItem = signal<number>(0);
    first = signal<number>(0);
    rows = signal<number>(5);
    totalRecords: number = 0;
    currentPage = signal<number>(0);
    accountId = signal<number | undefined>(0);
    filterObj = signal<UserSearch>({} as UserSearch);
    filterCriteria = USER_FILTER; // Define the filter criteria for the table
    firstname = signal<string | null>(null);
    lastname = signal<string | null>(null);
    emailid = signal<string | null>(null);
    phonenumber = signal<string | null>(null);
    search$ = new Subject<any>();

    constructor(
        private userService: UserService,
        private apiService: ServiceCallsService,
        private destroyRef: DestroyRef,
        private confirmationService: ConfirmationService
    ) {
        effect(() => {
            this.filterObj.update((obj) => ({
                ...obj,
                filters: {
                    id: null,
                    accountid: this.accountId() ?? 0,
                    firstname: untracked(() => this.firstname()) || null,
                    lastname: untracked(() => this.lastname()) || null,
                    address1: null,
                    address2: null,
                    emailid: untracked(() => this.emailid()) || null,
                    phonenumber: untracked(() => this.phonenumber()) || null,
                    role: null,
                    userid: null,
                    parentuserid: null,
                    usertype: null,
                    subscriptiontype: 'subscriber',
                },
                sort: null,
                pagenumber: this.currentPage() + 1,
                pagesize: this.rows(),
            }));
            console.log(this.filterObj());
            this.refreshTable$.next(this.filterObj());
        });
        this.accountId.set(this.userService.user().currentUser?.accountid);
        this.users = toSignal<User[]>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap((fObj: UserSearch) =>
                    this.apiService.getUserlist(fObj).pipe(
                        map((res: any) => {
                            !this.totalRecords &&
                                (this.totalRecords = res.count);
                            this.startItem.set(this.endItem() + 1);
                            this.endItem.set(
                                this.startItem() +
                                    (this.rows() < this.totalRecords
                                        ? this.rows()
                                        : this.totalRecords) -
                                    1
                            );
                            return res.data;
                        }),
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

    ngOnInit() {
        this.search$
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((searchTerm: any) => {
                this.resetPaginator();
                this.filterObj.update((obj) => ({
                    ...obj,
                    filters: {
                        ...obj.filters,
                        [searchTerm?.id as keyof UserSearch['filters']]:
                            searchTerm?.value || null,
                    },
                }));
            });
    }

    profileAction(action: string) {
        this.action.set(action);
        if (action === 'Update') {
            this.userService.selectedUser.update((user) => ({
                ...user,
                firstname: this.selectedUsers()[0].firstname,
                lastname: this.selectedUsers()[0].lastname,
                email: this.selectedUsers()[0].emailid,
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
                            this.refreshTable$.next(this.filterObj());
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

    onPageChange(event: PaginatorState) {
        console.log(event);
        this.first.set(event.first ?? this.first());
        this.rows.set(event.rows ?? this.rows());
        this.currentPage.set(event.page ?? this.currentPage() + 1);
        this.endItem.set(event.first ?? this.endItem());
        console.log(this.filterObj());
        this.refreshTable$.next(this.filterObj());
    }

    resetPaginator() {
        this.first.set(0);
        this.rows.set(5);
        this.currentPage.set(0);
        this.startItem.set(0);
        this.endItem.set(0);
        this.totalRecords = 0;
    }

    onChange(event: any) {
        const searchTerm = Object.assign({}, event.target);
        this.search$.next(searchTerm);
    }

    clearSearch(col: string) {
        (this[col as keyof UserManagementComponent] as WritableSignal<string | null>).set(null);
        this.resetPaginator();
        this.filterObj.update((obj) => ({
            ...obj,
            filters: {
                ...obj.filters,
                [col]: null,
            },
        }));
    }
}
