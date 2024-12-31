import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from 'primeng/card';
import { UserService } from './services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastConfig } from './models/models';
import { ProgressSpinner } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Card, ToastModule, ProgressSpinner, BlockUIModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [MessageService],
})
export class AppComponent {
    blockedDocument = signal(false);

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) {
        effect(() => {
            const toastConfig = this.userService.openToast();
            toastConfig.type && this.showToast(toastConfig);
            this.userService.showSpinner() && (this.blockedDocument.set(true));
        });
    }

    ngOnInit() {
        this.appInit();
    }

    appInit() {
        this.userService.setThemeBackground();
    }

    showToast(config: ToastConfig) {
        this.messageService.add({
            severity: config.type?.toLowerCase(),
            summary: config.type,
            detail: config.message,
        });
    }
}
