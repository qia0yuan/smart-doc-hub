import {
    Component,
    DestroyRef,
    effect,
    signal,
    Signal,
    untracked,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { PrimeNG } from 'primeng/config';
import { BadgeModule } from 'primeng/badge';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ServiceCallsService } from '../../services/service-calls.service';
import { HttpResponse } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { ConfirmationService } from 'primeng/api';
import {
    BehaviorSubject,
    catchError,
    forkJoin,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { Document } from '../../models/models';
import { ShareComponent } from './share/share.component';

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
        ShareComponent,
    ],
    templateUrl: './doc-management.component.html',
    styleUrl: './doc-management.component.scss',
})
export class DocManagementComponent {
    documents!: Signal<Document[] | undefined>;
    selectedDocuments = signal<Document[]>([]);
    visible = signal<boolean>(false);
    uploadedFiles: any[] = [];
    totalSize: number = 0;
    totalSizePercent: number = 0;
    refreshTable$ = new BehaviorSubject<void>(undefined);
    share = signal<Document[]>([]);

    constructor(
        private config: PrimeNG,
        private userService: UserService,
        private apiService: ServiceCallsService,
        private utilService: UtilService,
        private confirmationService: ConfirmationService,
        private destroyRef: DestroyRef
    ) {
        const userId = this.userService.user().currentUser?.id;
        this.documents = toSignal<any[]>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap(() =>
                    this.apiService.getDocumentsByUserId(userId).pipe(
                        catchError((err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Service call failed',
                            }));
                            return of([]);
                        }),
                        takeUntilDestroyed(this.destroyRef)
                    )
                )
            )
        );
        effect(() => {
            this.documents() &&
                untracked(() => {
                    this.userService.showSpinner.set(false);
                });
        });
    }

    ngOnInit() {}

    choose(event: any, callback: () => void) {
        callback();
    }

    uploadEvent(ulCallback: () => void, clearCallback: () => void) {
        const filesToUpload = [];
        for (let file of this.uploadedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            filesToUpload.push(this.apiService.uploadDocument(formData));
            this.totalSize += parseInt(this.formatSize(file.size));
        }
        this.userService.showSpinner.set(true);
        forkJoin(filesToUpload)
            .pipe(catchError((err) => throwError(() => err)))
            .subscribe((response) => {
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
            type: 'Success',
            message: 'File(s) Uploaded',
        }));
        this.refreshTable$.next();
    }

    onDownload(rows: Document[]) {
        console.log(rows);
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select file(s)',
            }));
        } else {
            const selectedDocs = rows.map((row) =>
                this.apiService
                    .downloadDocument(row.id)
                    .pipe(catchError((err) => of(row.title)))
            );
            this.userService.showSpinner.set(true);
            forkJoin(selectedDocs).subscribe({
                next: (resp: HttpResponse<Blob>[]) => {
                    this.userService.showSpinner.set(false);
                    let allOk = true;
                    resp.forEach((response, i) => {
                        if (response && response.ok) {
                            this.utilService.saveDownloadedFile(
                                response,
                                rows[i].title
                            );
                            this.selectedDocuments.update((selected) =>
                                selected.filter((doc) => doc.id !== rows[i].id)
                            );
                        } else {
                            allOk = false;
                        }
                    });
                    if (allOk) {
                        this.userService.openToast.update(() => ({
                            type: 'Success',
                            message: 'All Files Downloaded',
                        }));
                    } else {
                        this.userService.openToast.update(() => ({
                            type: 'error',
                            title: 'Error',
                            message: 'File(s) Download failed',
                        }));
                    }
                },
            });
        }
    }

    onDelete(rows: Document[]) {
        const selectedDocs = rows.map((row) =>
                this.apiService.deleteDocument(row.id)
            ),
            callback = () => {
                this.userService.showSpinner.set(true);
                forkJoin(selectedDocs)
                    .pipe(catchError((err) => throwError(() => err)))
                    .subscribe({
                        next: (resp) => {
                            this.userService.openToast.update(() => ({
                                type: 'Success',
                                message: 'File(s) Deleted successfully',
                            }));
                            this.selectedDocuments.set([]);
                            this.refreshTable$.next();
                        },
                        error: (err) => {
                            this.userService.showSpinner.set(false);
                            this.userService.openToast.update(() => ({
                                type: 'Error',
                                message: 'Failed to delete file(s)',
                            }));
                            this.selectedDocuments.set([]);
                        },
                    });
            };
        if (!rows.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select file(s)',
            }));
        } else {
            this.confirm(callback);
        }
    }

    onShare(docs: Document[]) {
        if (!docs.length) {
            this.userService.openToast.update(() => ({
                type: 'Warn',
                message: 'Please select file(s)',
            }));
            return;
        }
        this.share.set(docs);
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
