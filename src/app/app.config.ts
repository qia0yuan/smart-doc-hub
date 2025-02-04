import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpAuthInterceptor } from './shared/http-auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideRouter(routes, withHashLocation()),
        provideHttpClient(withInterceptors([httpAuthInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Material,
                options: {
                  darkModeSelector: '.dark-mode',
                },
            },
            ripple: true,
        }),
    ],
};
