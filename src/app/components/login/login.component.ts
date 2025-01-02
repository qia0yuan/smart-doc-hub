import { Component, computed, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ProfileComponent } from '../user-management/profile/profile.component';
import { UserService } from '../../services/user.service';
import { ServiceCallsService } from '../../services/service-calls.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        FloatLabel,
        ButtonModule,
        InputTextModule,
        RouterLink,
        IconField,
        InputIcon,
        ProfileComponent,
        CommonModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
    });
    action = signal<string>('');

    constructor(
        private router: Router,
        private userService: UserService,
        private apiService: ServiceCallsService
    ) {}

    clear(field: string) {
        this.loginForm.get(field)?.reset();
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const email = this.loginForm.get('email')?.value!,
                password = this.loginForm.get('password')?.value!;
            this.userService.showSpinner.update(() => true);
            this.apiService.login(email, password).subscribe(() => ({
                next: (response: any) => {
                    this.userService.showSpinner.update(() => false);
                    if (response && response.acess_token) {
                        this.userService.userDetails.update(
                            (user) => (user.token = response.acess_token)
                        );
                        this.router.navigate(['/home']);
                    }
                },
                error: (err: any) => {
                    this.userService.showSpinner.update(() => false);
                    this.userService.openToast.update(() => ({
                        type: 'Error',
                        message: 'Invalid credentials',
                    }));
                },
            }));
            this.router.navigate(['/home']); // This line is not needed
        }
    }
}
