import { Component, effect, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProfileComponent } from '../user-management/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-home',
    imports: [
        Menubar,
        RouterOutlet,
        ProfileComponent,
        Dialog,
        ButtonModule,
        InputTextModule,
        ToggleSwitchModule,
        ToggleButtonModule,
        FormsModule,
        ConfirmDialog,
        ToastModule,
        CommonModule,
        CheckboxModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    providers: [ConfirmationService],
})
export class HomeComponent implements OnInit {
    items: MenuItem[] | undefined;
    action = signal<string>('');
    visible = signal<boolean>(false);
    checked = signal<boolean>(true);
    notification = signal<string[]>([]);

    constructor(
        private userService: UserService,
    ) {
        effect(() => {
            this.userService.themeColorMode.set(
                this.checked() ? 'sun' : 'moon'
            );
        });
    }

    ngOnInit() {
        this.items = [
            {
                label: 'My Account',
                icon: 'pi pi-users',
                routerLink: '/home/account',
                routerLinkActiveOptions: { exact: true },
            },
            {
                label: 'Users',
                icon: 'pi pi-users',
                routerLink: '/home/users',
                routerLinkActiveOptions: { exact: true },
            },
            {
                label: 'Invitees',
                icon: 'pi pi-users',
                routerLink: '/home/invitees',
                routerLinkActiveOptions: { exact: true },
            },
            {
                label: 'Documents',
                icon: 'pi pi-file-o',
                routerLink: '/home/docs',
                routerLinkActiveOptions: { exact: true },
            },
            {
                label: this.userService.user().currentUser?.firstname,
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-user-edit',
                        command: () => this.action.set('Update'),
                    },
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        command: () => {
                            this.checked.set(
                                this.userService.getCurrentThemeBackground() ===
                                    'sun'
                                    ? true
                                    : false
                            );
                            this.visible.set(true);
                        },
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-power-off',
                        routerLink: '/login',
                    },
                ],
            },
        ];
    }

    onBtnClick(action: string) {
        if (action === 'save') {
            this.userService.setThemeBackground();
        }
        this.visible.set(false);
    }

}
