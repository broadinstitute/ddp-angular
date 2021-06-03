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
import { catchError, finalize, takeUntil } from 'rxjs/operators';

import { UploadFile } from '../../../../models/uploadFile';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ActivityFileAnswerDto } from '../../../../models/activity/activityFileAnswerDto';
import { FileUploadResponse } from '../../../../models/fileUploadResponse';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { ConfirmDialogComponent } from '../../../confirmDialog/confirmDialog.component';
import { ActivityFileValidationRule } from '../../../../services/activity/validators/activityFileValidationRule';
import { FileAnswerMapperService } from '../../../../services/fileAnswerMapper.service';

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
    @Output() componentBusy = new EventEmitter<boolean>();
    @ViewChild('uploaded', {read: ElementRef}) private uploadedFileRef: ElementRef;
    @ViewChild('undoUploadBtn', {read: ElementRef}) private undoUploadButtonRef: ElementRef;
    fileToUpload: UploadFile | null;
    uploadedFile: ActivityFileAnswerDto | null;
    errorMessage: string;
    isLoading: boolean;
    private ngUnsubscribe = new Subject();
    private readonly panelClass = 'file-upload-confirm-dialog';

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService,
                private dialog: MatDialog,
                private modalDialogService: ModalDialogService) {
    }

    ngOnInit(): void {
        this.initUploadedFile();
    }

    onFilesSelected(files: File[]): void {
        this.errorMessage = '';
        const file: File = files[0];

        if (file) {
            this.fileToUpload = {
                file,
                uploadGuid: null,
                uploadUrl: null
            };

            this.componentBusy.emit(true);
            this.fileUploadService.getUploadUrl(this.studyGuid, this.activityGuid, this.block.stableId, file)
                .pipe(
                    catchError(err => {
                        this.logger.logDebug('ActivityFileAnswer getUploadUrl error:', err);
                        this.errorMessage = err.message;
                        this.componentBusy.emit(false);
                        return EMPTY;
                    }),
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((res: FileUploadResponse) => {
                    this.fileToUpload = {
                        ...this.fileToUpload,
                        ...res
                    };
                    this.submitFileUpload();
                });
        }
    }

    submitFileUpload(): void {
        const failedLocalValidator = this.getFailedLocalValidator();
        if (failedLocalValidator) {
            this.errorMessage = failedLocalValidator.result;
            this.componentBusy.emit(false);
            return;
        }

        if (this.uploadedFile) {
            this.openReuploadConfirmDialog();
        } else {
            this.uploadFile();
        }
    }

    openReuploadConfirmDialog(): void {
        const config = this.modalDialogService.getDialogConfig(this.uploadedFileRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmReuploadTitle',
            confirmBtnText: 'SDK.FileUpload.ReuploadBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText',
            confirmBtnColor: 'primary'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmUpload: boolean) => {
            if (confirmUpload) {
                this.uploadFile();
            } else {
                this.componentBusy.emit(false);
            }
        });
    }

    undoUploadedFile(): void {
        const config = this.modalDialogService.getDialogConfig(this.undoUploadButtonRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmUndoUploadTitle',
            confirmBtnText: 'SDK.FileUpload.UndoBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText',
            confirmBtnColor: 'primary'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmUndo: boolean) => {
            if (confirmUndo) {
                this.patchAnswer(null);
                this.setUploadedFile(null);
            }
        });
    }

    getAllowedTypes(allowedFileTypes: string[] = []): string {
        return FileAnswerMapperService.mapMimeTypesToFileExtentions(allowedFileTypes).join(', ');
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private initUploadedFile(): void {
        if (this.block?.answer) {
            this.setUploadedFile({
                fileName: this.block.answer.fileName,
                fileSize: this.block.answer.fileSize
            });
        }
    }

    private uploadFile(): void {
        this.isLoading = true;
        this.fileUploadService.uploadFile(this.fileToUpload.uploadUrl, this.fileToUpload.file)
            .pipe(
                catchError(err => {
                    this.logger.logDebug('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe),
                finalize(() => {
                    this.componentBusy.emit(false);
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
                const uploadedFile = FileAnswerMapperService.mapFileAnswerDto(this.fileToUpload);
                this.patchAnswer(uploadedFile, this.fileToUpload.uploadGuid);
                this.setUploadedFile(uploadedFile);
                this.fileToUpload = null;
                this.errorMessage = '';
            });
    }

    private setUploadedFile(file: ActivityFileAnswerDto | null): void {
        this.uploadedFile = file;
    }

    private patchAnswer(file: ActivityFileAnswerDto | null, fileUploadGuid?: string): void {
        this.block.answer = file || null;
        this.valueChanged.emit(fileUploadGuid || null);
    }

    private getFailedLocalValidator(): ActivityFileValidationRule {
        return this.block.validators
            .filter(validator => validator instanceof ActivityFileValidationRule)
            .find(validator => {
                const preUploadFileAnswer: ActivityFileAnswerDto = {
                    ...FileAnswerMapperService.mapFileAnswerDto(this.fileToUpload),
                    fileMimeType: this.fileToUpload?.file?.type
                };
                return !validator.recalculate(preUploadFileAnswer);
            }) as ActivityFileValidationRule;
    }
}
