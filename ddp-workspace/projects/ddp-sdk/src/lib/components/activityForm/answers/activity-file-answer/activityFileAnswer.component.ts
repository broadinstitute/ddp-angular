import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UploadFile } from '../../../../models/uploadFile';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ActivityFileAnswerDto } from '../../../../models/activity/activityFileAnswerDto';
import { FileUploadBody } from '../../../../models/fileUploadBody';
import { FileUploadResponse } from '../../../../models/fileUploadResponse';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { ConfirmDialogComponent } from '../../../confirmDialog/confirmDialog.component';
import { ActivityFileValidationRule } from '../../../../services/activity/validators/activityFileValidationRule';
import { FILE_SIZE_MEASURE } from '../../../../models/fileSizeMeasure';

@Component({
    selector: 'ddp-activity-file-answer',
    templateUrl: 'activityFileAnswer.component.html',
    styleUrls: ['activityFileAnswer.component.scss']
})
export class ActivityFileAnswer implements OnInit, OnDestroy {
    @Input() block: ActivityFileQuestionBlock;
    @Input() readonly: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    @ViewChild('uploadBtn', {read: ElementRef}) private uploadButtonRef: ElementRef;
    @ViewChild('undoUploadBtn', {read: ElementRef}) private undoUploadButtonRef: ElementRef;
    readonly fileSizeMeasure = FILE_SIZE_MEASURE;
    selectedFile: File;
    isFileSelected: boolean;
    uploadedFile: UploadFile | null;
    fileMaxSize: number;
    fileMimeTypes: string[];
    errorMessage: string;
    private fileToUpload: UploadFile | null;
    private ngUnsubscribe = new Subject();
    private readonly panelClass = 'file-upload-confirm-dialog';

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService,
                private dialog: MatDialog,
                private modalDialogService: ModalDialogService) {
    }

    ngOnInit(): void {
        this.initFileRequirements();
        this.initUploadedFile();
    }

    onFilesSelected(files: File[]): void {
        const file: File = files[0];

        if (file) {
            this.selectedFile = file;

            const requestBody: FileUploadBody = {
                questionStableId: this.block.stableId,
                fileName: this.selectedFile.name,
                fileSize: this.selectedFile.size,
                mimeType: this.selectedFile.type
            };

            this.fileUploadService.getUploadUrl(this.studyGuid, this.activityGuid, requestBody)
                .pipe(
                    catchError(err => {
                        this.logger.logDebug('ActivityFileAnswer getUploadUrl error:', err);
                        this.errorMessage = err.message;
                        return EMPTY;
                    }),
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((res: FileUploadResponse) => {
                    this.isFileSelected = true;
                    this.fileToUpload = {
                        ...res,
                        name: file.name,
                        size: file.size,
                        fileMimeType: file.type,
                        isUploaded: false
                    };
                });
        }
    }

    submitFileUpload(): void {
        const failedLocalValidator = this.getFailedLocalValidator();
        if (failedLocalValidator) {
            this.errorMessage = failedLocalValidator.result;
            return;
        }

        if (this.uploadedFile) {
            this.openReuploadConfirmDialog();
        } else {
            this.uploadFile();
        }
    }

    openReuploadConfirmDialog(): void {
        const config = this.modalDialogService.getDialogConfig(this.uploadButtonRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmReuploadTitle',
            confirmBtnText: 'SDK.FileUpload.ReuploadBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmUpload: boolean) => {
            if (confirmUpload) {
                this.uploadFile();
            }
        });
    }

    undoUploadedFile(): void {
        const config = this.modalDialogService.getDialogConfig(this.undoUploadButtonRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmUndoUploadTitle',
            confirmBtnText: 'SDK.FileUpload.UndoBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmUndo: boolean) => {
            if (confirmUndo) {
                this.patchAnswer(null);
                this.setUploadedFile(null);
            }
        });
    }

    mapMimeTypesToFileExtentions(mimeTypes: string[]): string[] {
        return mimeTypes.map((mimeType: string) => {
            const [type, subtype] = mimeType.split('/');
            return '*.' + subtype;
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private initFileRequirements(): void {
        this.fileMaxSize = this.block.maxFileSize;
        this.fileMimeTypes = this.block.mimeTypes || [];
    }

    private initUploadedFile(): void {
        if (this.block?.answer) {
            this.setUploadedFile({
                uploadGuid: '',
                uploadUrl: '',
                name: this.block.answer.fileName,
                size: this.block.answer.fileSize,
                isUploaded: true
            } as UploadFile);
        }
    }

    private uploadFile(): void {
        this.fileUploadService.uploadFile(this.fileToUpload.uploadUrl, this.selectedFile)
            .pipe(
                catchError(err => {
                    this.logger.logDebug('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.patchAnswer(this.fileToUpload);
                this.setUploadedFile({
                    ...this.fileToUpload,
                    isUploaded: true
                });
                this.resetSelectedFile();
                this.errorMessage = '';
            });
    }

    private setUploadedFile(file: UploadFile | null): void {
        this.uploadedFile = file;
    }

    private patchAnswer(file: UploadFile | null): void {
        this.block.answer = file ? { fileName: file.name, fileSize: file.size } : null;
        this.valueChanged.emit(file?.uploadGuid || null);
    }

    private resetSelectedFile(): void {
        this.selectedFile = null;
        this.isFileSelected = false;
    }

    private getFailedLocalValidator(): ActivityFileValidationRule {
        return this.block.validators
            .filter(validator => validator instanceof ActivityFileValidationRule)
            .find(validator => {
                const preUploadFileAnswer: ActivityFileAnswerDto = {
                    fileName: this.fileToUpload?.name,
                    fileSize: this.fileToUpload?.size,
                    fileMimeType: this.fileToUpload?.fileMimeType
                };
                return !validator.recalculate(preUploadFileAnswer);
            }) as ActivityFileValidationRule;
    }
}
