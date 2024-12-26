import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
    selector: 'app-home',
    imports: [Menubar, RouterOutlet],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
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
            // {
            //     label: 'Projects',
            //     icon: 'pi pi-search',
            //     items: [
            //         {
            //             label: 'Components',
            //             icon: 'pi pi-bolt',
            //         },
            //         {
            //             label: 'Blocks',
            //             icon: 'pi pi-server',
            //         },
            //         {
            //             label: 'UI Kit',
            //             icon: 'pi pi-pencil',
            //         },
            //         {
            //             label: 'Templates',
            //             icon: 'pi pi-palette',
            //             items: [
            //                 {
            //                     label: 'Apollo',
            //                     icon: 'pi pi-palette',
            //                 },
            //                 {
            //                     label: 'Ultima',
            //                     icon: 'pi pi-palette',
            //                 },
            //             ],
            //         },
            //     ],
            // },
            // {
            //     label: 'Contact',
            //     icon: 'pi pi-envelope',
            // },
            {
                label: 'George',
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-user-edit',
                    },
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
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
}
