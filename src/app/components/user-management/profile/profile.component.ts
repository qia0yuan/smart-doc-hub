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
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';

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
        AccordionModule,
        FileUploadModule,
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
    uploadedFiles = signal<File[]>([]);
    chooseStyleClass = signal<string>('p-button-rounded p-button-outlined');
    uploadStyleClass = signal<string>('p-button-rounded p-button-outlined');

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
                    : this.from() === 'login'
                    ? this.fb.group({
                          firstname: [''],
                          lastname: [''],
                          email: ['', [Validators.required, Validators.email]],
                          address1: ['', [Validators.required]],
                          address2: [''],
                          telephone: ['', [Validators.required]],
                          company: ['', [Validators.required]],
                          password: [''],
                          userid: [''],
                          primary: this.fb.group({
                              firstname: ['', [Validators.required]],
                              lastname: ['', [Validators.required]],
                              email: [
                                  '',
                                  [Validators.required, Validators.email],
                              ],
                              address1: [''],
                              address2: [''],
                              telephone: [''],
                              company: [''],
                              password: [''],
                              userid: [''],
                          }),
                          secondary: this.fb.group({
                              firstname: ['', [Validators.required]],
                              lastname: ['', [Validators.required]],
                              email: [
                                  '',
                                  [Validators.required, Validators.email],
                              ],
                              address1: [''],
                              address2: [''],
                              telephone: [''],
                              company: [''],
                              password: [''],
                              userid: [''],
                          }),
                      })
                    : this.action() === 'Bulk upload'
                    ? (this.onDeselect(null), this.fb.group({}))
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

    clear(field1: string, field2?: string) {
        if (field2) {
            this.userProfileForm.get(field1)?.get(field2)?.reset();
            return;
        }
        this.userProfileForm.get(field1)?.reset();
    }

    onSubmit(extra?: any) {
        if (this.userProfileForm.valid || this.action() === 'Bulk upload') {
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
                    subscriptiontype:
                        this.from() === 'subscriber' ? 'subscriber' : '',
                },
                account = {
                    name: this.userProfileForm.get('company')?.value || '',
                    primarycontact: {
                        "lastname": this.userProfileForm.get('primary')?.get('lastname')?.value || '',
                        "firstname": this.userProfileForm.get('primary')?.get('firstname')?.value || '',
                        "emailid": this.userProfileForm.get('primary')?.get('email')?.value || '',
                        "role": 1,
                        "password": this.userProfileForm.get('primary')?.get('password')?.value || '',
                        "usertype": null,
                        "address1": this.userProfileForm.get('primary')?.get('address1')?.value || '',
                        "address2": this.userProfileForm.get('primary')?.get('address2')?.value || '',
                        "phonenumber": this.userProfileForm.get('primary')?.get('telephone')?.value || '',
                        "userid": this.userProfileForm.get('primary')?.get('userid')?.value || '',
                        "parentuserid": null,
                        "subscriptiontype": "subscriber"
                    },
                    secondarycontact: {
                        "lastname": this.userProfileForm.get('secondary')?.get('lastname')?.value || '',
                        "firstname": this.userProfileForm.get('secondary')?.get('firstname')?.value || '',
                        "emailid": this.userProfileForm.get('secondary')?.get('email')?.value || '',
                        "role": 1,
                        "password": this.userProfileForm.get('secondary')?.get('password')?.value || '',
                        "usertype": null,
                        "address1": this.userProfileForm.get('secondary')?.get('address1')?.value || '',
                        "address2": this.userProfileForm.get('secondary')?.get('address2')?.value || '',
                        "phonenumber": this.userProfileForm.get('secondary')?.get('telephone')?.value || '',
                        "userid": this.userProfileForm.get('secondary')?.get('userid')?.value || '',
                        "parentuserid": null,
                        "subscriptiontype": "subscriber"
                    }
                },
                userId = this.userService.user().currentUser?.id,
                create$ =
                    this.from() === 'invitee'
                        ? this.action() === 'Bulk upload'
                        ? this.apiService.uploadBulkUser(extra)
                        : this.apiService.createInvitee(user)
                        : this.from() === 'subscriber'
                        ? this.apiService.createUser(user)
                        : this.from() === 'login'
                        ? this.apiService.createAccount({...user, ...account})
                        :this.apiService.subscribeInvitee(user);
            create$.subscribe({
                next: (resp) => {
                    this.userProfileForm.reset();
                    this.onBtnClick('cancel');
                    this.userService.openToast.update(() => ({
                        type: 'Success',
                        message: 'Service call successful',
                    }));
                    this.from() === 'register' &&
                        this.router.navigate(['/login']);
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

    onUpload(event: any) {
        console.log(event);
    }

    onSend(event: any) {
        console.log(event);
    }

    onUploadHandler(event: any) {
        console.log(event);
        const formData = new FormData();
        formData.append('file', event.files[0]);
        this.onSubmit(formData);
    }

    onSelect(event: any) {
        this.chooseStyleClass.set('p-button-rounded p-button-outlined choose-off');
        this.uploadStyleClass.set('p-button-rounded p-button-outlined upload-on');
    }

    onDeselect(event: any) {
        this.chooseStyleClass.set('p-button-rounded p-button-outlined choose-on');
        this.uploadStyleClass.set('p-button-rounded p-button-outlined upload-off');
    }
}
