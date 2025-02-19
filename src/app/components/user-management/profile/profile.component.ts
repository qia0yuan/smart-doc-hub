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
import { Router } from '@angular/router';

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
    action = input<string>('Update');
    from = input<string>('register');
    closed = output();
    visible = signal<boolean>(false);
    closeIconClicked = effect(() => {
        !this.visible() && this.closed.emit();
    });
    userProfileForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private apiService: ServiceCallsService,
        private router: Router
    ) {
        effect(() => {
            this.visible.set(this.action() ? true : false);
            this.userProfileForm =
                this.action() === 'Update'
                    ? this.fb.group({
                          firstname: [
                              this.userService.selectedUser().firstname ||
                                  this.userService.user().currentUser
                                      ?.firstname ||
                                  '',
                              [Validators.required],
                          ],
                          lastname: [
                              this.userService.selectedUser().lastname ||
                                  this.userService.user().currentUser
                                      ?.lastname ||
                                  '',
                              [Validators.required],
                          ],
                          email: [
                              this.userService.selectedUser().emailid ||
                                  this.userService.user().currentUser
                                      ?.emailid ||
                                  '',
                              [Validators.required, Validators.email],
                          ],
                          address1: [
                              this.userService.selectedUser().address1 ||
                                  this.userService.user().currentUser
                                      ?.address1 ||
                                  '',
                          ],
                          address2: [
                              this.userService.selectedUser().address2 ||
                                  this.userService.user().currentUser
                                      ?.address2 ||
                                  '',
                          ],
                          telephone: [
                              this.userService.selectedUser().phonenumber ||
                                  this.userService.user().currentUser
                                      ?.phonenumber ||
                                  '',
                          ],
                          company: [''],
                          password: [
                              this.userService.selectedUser().password ||
                                  this.userService.user().currentUser
                                      ?.password ||
                                  '',
                          ],
                          userid: [
                              this.userService.selectedUser().userid ||
                                  this.userService.user().currentUser?.userid ||
                                  '',
                          ],
                      })
                    : this.fb.group({
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
        });
    }

    ngOnInit() {
        this.visible.set(false);
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
                    accountid:
                        this.userService.user().currentUser?.accountid || 50,
                    firstname:
                        this.userProfileForm.get('firstname')?.value || '',
                    lastname: this.userProfileForm.get('lastname')?.value || '',
                    address1: this.userProfileForm.get('address1')?.value || '',
                    address2: this.userProfileForm.get('address2')?.value || '',
                    emailid: this.userProfileForm.get('email')?.value || '',
                    phonenumber:
                        this.userProfileForm.get('telephone')?.value || '',
                    role: 1,
                    id: this.userService.user().currentUser?.id || 0,
                    userid: this.userProfileForm.get('userid')?.value || '',
                    password: this.userProfileForm.get('password')?.value || '',
                    subscriptiontype: this.from() === 'subscriber' ? 'subscriber' : '',
                },
                userId = this.userService.user().currentUser?.id,
                create$ =
                    this.from() === 'invitee'
                        ? this.apiService.createInvitee(user)
                        : this.from() === 'subscriber' ? this.apiService.createUser(user) : this.apiService.subscribeInvitee(user);
            create$.subscribe({
                next: (resp) => {
                    this.userProfileForm.reset();
                    this.onBtnClick('cancel');
                    this.userService.openToast.update(() => ({
                        type: 'Success',
                        message: 'Service call successful',
                    }));
                    this.from() === 'register' && this.router.navigate(['/login']);
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
