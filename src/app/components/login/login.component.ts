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
import { concatMap } from 'rxjs';

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
        username: new FormControl('', Validators.required),
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
            const username = this.loginForm.get('username')?.value!,
                password = this.loginForm.get('password')?.value!;
            this.userService.showSpinner.update(() => true);
            this.apiService.login(username, password).pipe(
              concatMap((token: any) => {
                if (token) {
                  this.userService.user.update((user) => ({
                    ...user,
                    token: token.access_token,
                  }));
                  return this.apiService.getUserByUsername(username);
                } else {
                  throw new Error('Login failed');
                }
              })
            )
            .subscribe({
                next: (data: any) => {
                    this.userService.showSpinner.update(() => false);
                    if (data) {
                        this.userService.user.update((user) => ({
                            ...user,
                            currentUser: data[0],
                        }));
                        this.router.navigate(['/home']);
                    }
                },
                error: (err: any) => {
                    this.userService.showSpinner.update(() => false);
                    this.userService.openToast.update(() => ({
                        type: 'Error',
                        message: 'Login failed',
                    }));
                },
            });
        }
    }
}
