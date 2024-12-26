import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'docs',
                pathMatch: 'full',
            },
            {
                path: 'docs',
                loadComponent: () => import('./components/doc-management/doc-management.component').then(m => m.DocManagementComponent),
            },
            {
                path: 'users',
                loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
            }
        ]
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
    }
];
