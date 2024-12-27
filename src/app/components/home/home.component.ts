import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProfileComponent } from '../user-management/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

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
        FormsModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    items: MenuItem[] | undefined;
    action = signal<string>('');
    visible = false;
    checked = true;

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.checked =
            this.userService.themeColorMode() === 'sun' ? true : false;
        this.items = [
            {
                label: 'Documents',
                icon: 'pi pi-file-o',
                routerLink: '/home/docs',
            },
            {
                label: 'Users',
                icon: 'pi pi-users',
                routerLink: '/home/users',
            },
            {
                label: 'George',
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
                            this.visible = true;
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

    onThemeBgChange(event: boolean) {
        this.checked = event;
        this.userService.themeColorMode.set(event ? 'sun' : 'moon');
    }

    onBtnClick(action: string) {
        if (action === 'save') {
            this.userService.setThemeBackground();
        }
        this.visible = false;
    }
}
