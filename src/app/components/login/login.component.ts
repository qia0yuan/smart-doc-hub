import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

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
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(private router: Router) {}

    onSubmit() {
        this.router.navigate(['/home']);
    }
}
