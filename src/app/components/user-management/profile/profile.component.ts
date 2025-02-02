import { Component, effect, input, output, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { ServiceCallsService } from '../../../services/service-calls.service';
import { User } from '../../../models/models';

@Component({
    selector: 'app-profile',
    imports: [
        ButtonModule,
        Dialog,
        InputTextModule,
        IconField,
        InputIcon,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    action = input<string>('');
    from = input<string>('');
    closed = output();
    visible = signal<boolean>(false);
    closeIconClicked = effect(() => {
        !this.visible() && this.closed.emit();
    });
    userProfileForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private apiService: ServiceCallsService
    ) {
        effect(() => {
            this.visible.set(this.action() ? true : false);
        });
    }

    ngOnInit() {
        this.userProfileForm = this.fb.group({
            firstname: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            address1: [''],
            address2: [''],
            telephone: [''],
            company: [''],
            password: [''],
            userid: [''],
        });
    }

    onBtnClick(action: string) {
        this.closed.emit();
        this.visible.set(false);
    }

    clear(field: string) {
        this.userProfileForm.get(field)?.reset();
    }

    onSubmit() {
        if (this.userProfileForm.valid) {
            const user: User = {
                accountid: this.userService.user().currentUser?.accountid,
                firstname:
                this.userProfileForm.get('firstname')?.value || '',
                lastname: this.userProfileForm.get('lastname')?.value || '',
                address1: this.userProfileForm.get('address1')?.value || '',
                address2: this.userProfileForm.get('address2')?.value || '',
                emailid: this.userProfileForm.get('email')?.value || '',
                phonenumber:
                this.userProfileForm.get('telephone')?.value || '',
                role: 0,
                id: 0,
                userid: this.userProfileForm.get('userid')?.value || '',
                password: this.userProfileForm.get('password')?.value || '',
                subscriptiontype: '',
            },
            userId = this.userService.user().currentUser?.id,
            create$ = this.from() === 'invitee' ? this.apiService.createInvitee(user) : this.apiService.createUser(user);
                create$.subscribe({
                    next: (resp) => {
                        this.userProfileForm.reset();
                        this.onBtnClick('cancel');
                        this.userService.openToast.update(() => ({
                            type: 'Success',
                            message: 'Service call successful',
                        }));
                    },
                    error: (err) => {
                        this.userService.openToast.update(() => ({
                            type: 'Error',
                            message: 'Service call failed',
                        }));
                    },
                });
            }
        }
    }
