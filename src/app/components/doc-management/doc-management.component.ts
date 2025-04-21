import {
    Component,
    DestroyRef,
    effect,
    signal,
    Signal,
    untracked,
    WritableSignal,
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
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { ServiceCallsService } from '../../services/service-calls.service';
import { HttpResponse } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { ConfirmationService } from 'primeng/api';
import {
    BehaviorSubject,
    catchError,
    forkJoin,
    of,
    map,
    switchMap,
    tap,
    throwError,
    debounceTime,
    distinctUntilChanged,
    Subject,
    Observable,
} from 'rxjs';
import { DocSearch, Document } from '../../models/models';
import { ShareComponent } from './share/share.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DOCUMENT_FILTER, DOCUMENT_TYPE_FILTER } from '../../constants/common.constant';
import { TreeSelectModule } from 'primeng/treeselect';

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
        SelectModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        PaginatorModule,
        IftaLabelModule,
        TreeSelectModule,
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
    share = signal<Document[]>([]);
    // fileTypeOptions = [
    //     { label: 'All', value: 'All' },
    //     { label: 'Images', value: 'Image' },
    //     { label: 'Videos', value: 'Video' },
    //     { label: 'Documents', value: 'Document' },
    //     { label: 'Audio', value: 'Audio' },
    // ];
    selectedFileType = signal<string>('All');
    refreshTable$: BehaviorSubject<DocSearch> = new BehaviorSubject<DocSearch>(
        {} as DocSearch
    );
    startItem = signal<number>(0);
    endItem = signal<number>(0);
    first = signal<number>(0);
    rows = signal<number>(5);
    totalRecords: number = 0;
    currentPage = signal<number>(0);
    userId = signal<number | undefined>(0);
    filterObj = signal<DocSearch>({} as DocSearch);
    filterCriteria = DOCUMENT_FILTER;
    searchField: Record<string, ReturnType<typeof signal<string | null>>> = {};
    sharedByUser = signal<string | null>(null);
    search$ = new Subject<any>();
    selectedNodes: Record<string, any> = {};
    nodes = DOCUMENT_TYPE_FILTER;

    constructor(
        private config: PrimeNG,
        private userService: UserService,
        private apiService: ServiceCallsService,
        private utilService: UtilService,
        private confirmationService: ConfirmationService,
        private destroyRef: DestroyRef
    ) {
        effect(() => {
            this.filterObj.update((obj) => ({
                ...obj,
                filters: {
                    ...Object.keys(this.searchField).reduce(
                        (acc, key) => {
                            acc[key] = untracked(() => this.searchField[key]()) ?? null;
                            return acc;
                        }, {} as Record<string, string | null>),
                    createdByUserId: this.userId() ?? 0,
                } as Record<keyof DocSearch['filters'], any>,
                sort: {
                    docid: '',
                },
                pagenumber: this.currentPage() + 1,
                pagesize: this.rows(),
            }));
            console.log(this.filterObj());
            this.refreshTable$.next(this.filterObj());
        });
        this.userId.set(this.userService.user().currentUser?.id);
        this.documents = toSignal<Document[]>(
            this.refreshTable$.pipe(
                tap(() => this.userService.showSpinner.set(true)),
                switchMap((fObj: DocSearch) =>
                    this.apiService.getDoclist(fObj).pipe(
                        map((res: any) => {
                            !this.totalRecords &&
                                (this.totalRecords = res.count);
                            this.startItem.set(this.endItem() + 1);
                            this.endItem.set(
                                this.startItem() +
                                (this.rows() < this.totalRecords
                                    ? this.rows()
                                    : this.totalRecords) -
                                1
                            );
                            return res.data;
                        }),
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

    ngOnInit() {
        DOCUMENT_FILTER.forEach((filter) => {
            this.searchField[filter.id] = signal<string | null>(null);
        });
        this.search$
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((searchTerm: any) => {
                this.resetPaginator();
                this.filterObj.update((obj) => ({
                    ...obj,
                    filters: {
                        ...obj.filters,
                        [searchTerm?.id as keyof DocSearch['filters']]:
                            searchTerm?.value || null,
                    },
                }));
            });
    }

    choose(event: any, callback: () => void) {
        callback();
    }

    uploadEvent(ulCallback: () => void, clearCallback: () => void) {
        const filesToUpload = [];
        for (let file of this.uploadedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', this.selectedNodes[file.name].parent ? this.selectedNodes[file.name].parent.label : this.selectedNodes[file.name].label);
            formData.append('subcategory', this.selectedNodes[file.name].parent ? this.selectedNodes[file.name].label : null);
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
        this.refreshTable$.next(this.filterObj());
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
                            this.refreshTable$.next(this.filterObj());
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

    onChange(event: any) {
        const searchTerm = Object.assign({}, event.target);
        this.search$.next(searchTerm);
    }

    onPageChange(event: PaginatorState) {
        console.log(event);
        this.first.set(event.first ?? this.first());
        this.rows.set(event.rows ?? this.rows());
        this.currentPage.set(event.page ?? this.currentPage() + 1);
        this.endItem.set(event.first ?? this.endItem());
        console.log(this.filterObj());
        this.refreshTable$.next(this.filterObj());
    }

    clearSearch(col: string) {
        (
            this.searchField[col as keyof DocManagementComponent] as WritableSignal<
                string | null
            >
        ).set(null);
        this.resetPaginator();
        this.filterObj.update((obj) => ({
            ...obj,
            filters: {
                ...obj.filters,
                [col]: null,
            },
        }));
    }

    resetPaginator() {
        this.first.set(0);
        this.rows.set(5);
        this.currentPage.set(0);
        this.startItem.set(0);
        this.endItem.set(0);
        this.totalRecords = 0;
    }
}
