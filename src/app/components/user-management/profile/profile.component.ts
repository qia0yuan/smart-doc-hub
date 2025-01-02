import { Component, effect, input, output, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    closed = output();
    visible = signal<boolean>(false);
    closeIconClicked = effect(() => {
        !this.visible() && this.closed.emit();
    });
    userProfileForm!: FormGroup;

    constructor(private fb: FormBuilder) {
        effect(() => {
            this.visible.set(this.action() ? true : false);
        });
    }

    ngOnInit() {
        this.userProfileForm = this.fb.group({
            firstname: [''],
            lastname: [''],
            email: [''],
            address: [''],
            telephone: [''],
            company: [''],
            password: [''],
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
            this.onBtnClick('cancel');
        }
    }
}
