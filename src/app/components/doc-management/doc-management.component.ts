import { Component, signal, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { PrimeNG } from 'primeng/config';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiceCallsService } from '../../services/service-calls.service';
import { HttpResponse } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, switchMap } from 'rxjs';

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
    documents!: Signal<any[] | undefined>;
    selectedProducts = signal<any>(null);
    visible = signal<boolean>(false);
    uploadedFiles: any[] = [];
    totalSize: number = 0;
    totalSizePercent: number = 0;
    refreshTable$ = new BehaviorSubject<void>(undefined);

    constructor(
        private config: PrimeNG,
        private userService: UserService,
        private apiService: ServiceCallsService,
        private utilService: UtilService,
        private confirmationService: ConfirmationService,
    ) {
        const userId = this.userService.user().currentUser?.id;
        this.documents = toSignal<Document[]>(this.refreshTable$.pipe(
            switchMap(() => this.apiService.getDocumentsByUserId(userId))
        ))
    }
    
    ngOnInit() {
        this.userService.showSpinner.set(false);
    }

    choose(event: any, callback: () => void) {
        callback();
    }

    uploadEvent(ulCallback: () => void, clearCallback: () => void) {
        const formData = new FormData();
        for (let file of this.uploadedFiles) {
            formData.append('file', file);
            this.totalSize += parseInt(this.formatSize(file.size));
        }
        this.apiService.uploadDocument(formData).subscribe((response) => {
            console.log(response);
            ulCallback();
            this.onTemplatedUpload();
            clearCallback();
            this.visible.set(false);
        });
    }

    onSelectedFiles(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

    clearAll() {
        this.uploadedFiles = [];
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
        this.refreshTable$.next();
    }

    onDownload(rows: any) {
        console.log(rows);
        this.apiService.downloadDocument(rows[0].title).subscribe((response: HttpResponse<any>) => {
            console.log(response);
            if (response && response.ok) {
                this.utilService.saveDownloadedFile(response, rows[0].title);
            }
        });
        // this.userService.confirmDialog.set(true);
    }

    onDelete(rows: any) {
        const callback = () => {
            this.apiService.deleteDocument(rows[0].title).subscribe(resp => {
                console.log(resp);
                this.refreshTable$.next();
            });
        };
        this.confirm(callback);
    }

    onShare() {
        // this.userService.showSpinner.set(true);
    }

    confirm(cb: () => void) {
        this.confirmationService.confirm({
            header: 'Are you sure?',
            message: 'Please confirm to proceed.',
            accept: cb,
            reject: () => {
                // this.userService.openToast.update(() => ({
                //     type: 'info',
                //     message: 'You have rejected',
                // }));
            },
        });
    }

}
