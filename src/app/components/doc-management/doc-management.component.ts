import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { PrimeNG } from 'primeng/config';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-doc-management',
    imports: [
        TableModule,
        ButtonModule,
        FileUpload,
        ToastModule,
        CommonModule,
        Dialog,
        BadgeModule,
    ],
    templateUrl: './doc-management.component.html',
    styleUrl: './doc-management.component.scss',
})
export class DocManagementComponent {
    products!: any[];
    selectedProducts!: any;
    visible = signal<boolean>(false);
    uploadedFiles: any[] = [];
    totalSize: number = 0;
    totalSizePercent: number = 0;

    constructor(
        private config: PrimeNG,
        private userService: UserService,
    ) {}

    choose(event: any, callback: () => void) {
        callback();
    }

    uploadEvent(callback: () => void) {
        callback();
    }

    onSelectedFiles(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.userService.openToast.update(() => ({
            type: 'info',
            message: '',
        }));
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes?.[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes?.[i]}`;
    }

    onRemoveTemplatingFile(
        event: any,
        file: any,
        removeFileCallback: any,
        index: any
    ) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear: any) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.userService.openToast.update(() => ({
            type: 'info',
            message: 'File Uploaded',
        }));
    }

    onDownload() {
        this.userService.confirmDialog.set(true);
    }

    onDelete() {
        this.userService.confirmDialog.set(true);
    }

    onShare() {
        // this.userService.showSpinner.set(true);
    }

    ngOnInit() {
        this.products = [
            {
                id: '1000',
                name: 'August_statement_2021.pdf',
                description: 'Bank statement for the month of August 2021.',
                category: 'Banking',
                date: '08/01/2021',
            },
            {
                id: '1001',
                name: 'Sept_statement_2021.pdf',
                description: 'Bank statement for the month of Sept 2021.',
                category: 'Banking',
                date: '09/01/2021',
            },
            {
                id: '1002',
                name: 'Oct_statement.pdf',
                description: 'Bank statement for the month of Sept 2021.',
                category: 'Banking',
                date: '09/01/2021',
            },
        ];
        this.userService.showSpinner.set(false);
    }
}
