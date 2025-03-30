import { Component, effect, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { User, Document } from '../../../models/models';
import { ServiceCallsService } from '../../../services/service-calls.service';
import { UserService } from '../../../services/user.service';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-share',
    imports: [
        Dialog,
        ReactiveFormsModule,
        ButtonModule,
        MultiSelectModule,
        FloatLabel,
    ],
    templateUrl: './share.component.html',
    styleUrl: './share.component.scss',
})
export class ShareComponent {
    action = input<Document[]>([]);
    visible = signal<boolean>(false);
    closed = output();
    docShareForm!: FormGroup;
    isLoading = signal<boolean>(false);
    users = signal<User[] | undefined>([]);

    constructor(
        private fb: FormBuilder,
        private apiService: ServiceCallsService,
        private userService: UserService
    ) {
        effect(() => {
            this.visible.set(this.action().length > 0);
            this.docShareForm = this.fb.group({
                users: [],
            });
        });
    }

    onClose() {
        this.closed.emit();
        // this.visible.set(false);
    }

    onSubmit() {
        const invitationusers = this.docShareForm.get('users')?.value,
            inviteObj = {
                id: this.userService.user().currentUser?.id,
                requestedby: this.userService.user().currentUser?.id,
                approvalflag: null,
                description: '',
                expireflag: '',
                createdby: 1,
                updatedby: 1,
                invitationusers: invitationusers.map((user: any) => ({
                    id: null,
                    invitationrequestid: null,
                    userid: user.id,
                    userFirstName: user.firstname,
                    userLastName: user.lastname,
                    token: null,
                    status: '',
                    shareddocuments: this.action().map((doc) => ({
                        id: null,
                        accessuserrequestid: null,
                        docid: doc.id,
                        status: '',
                    })),
                })),
            };
        this.userService.showSpinner.set(true);
        this.apiService.shareDocument(inviteObj).subscribe({
            next: (resp) => {
                this.userService.openToast.update(() => ({
                    type: 'Success',
                    message: 'Document(s) shared',
                }));
                this.userService.showSpinner.set(false);
            },
            error: (err) => {
                this.userService.showSpinner.set(false);
                this.userService.openToast.update(() => ({
                    type: 'Error',
                    message: 'Share failed',
                }));
            },
        });
        this.closed.emit();
    }

    loadUserList() {
        // const accountId = this.userService.user().currentUser?.accountid;
        // this.isLoading.set(true);
        // this.apiService.getUserlist(accountId).subscribe((res) => {
        //     if (res.length) {
        //         this.users.set(res);
        //     }
        //     this.isLoading.set(false);
        // });
    }
}
