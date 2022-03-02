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
    @Output() valueChanged: EventEmitter<string[] | null> = new EventEmitter();
    @Output() componentBusy = new EventEmitter<boolean>();
    @ViewChild('uploaded', {read: ElementRef}) private uploadedFileRef: ElementRef;
    @ViewChild('undoUploadBtn', {read: ElementRef}) private undoUploadButtonRef: ElementRef;
    @ViewChild('cancelUploadBtn', {read: ElementRef}) private cancelUploadingButtonRef: ElementRef;
    fileNameToUpload: string;
    uploadedFiles: ActivityFileAnswerDto[] | null = [];
    errorMessage: string;
    isLoading: boolean;
    private activityGuids: string[] = [];
    private ngUnsubscribe = new Subject<void>();
    private readonly panelClass = 'file-upload-confirm-dialog';

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService,
                private dialog: MatDialog,
                private modalDialogService: ModalDialogService) {
    }

    ngOnInit(): void {
        this.initUploadedFile();
    }

    onFilesSelected(files: Event): void {
        this.errorMessage = '';
        const filesGroup: File[] = Array.from((files.target as HTMLInputElement).files);
        if (filesGroup && filesGroup.length > 0) {
            this.componentBusy.emit(true);
            this.fileUploadService.getUploadUrl(this.studyGuid, this.activityGuid, this.block.stableId, filesGroup)
                .pipe(
                    catchError(err => {
                        this.logger.logDebug('ActivityFileAnswer getUploadUrl error:', err);
                        this.errorMessage = err.message;
                        this.componentBusy.emit(false);
                        return EMPTY;
                    }),
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((res: FileUploadResponse[]) => {
                        for(let i = 0; i < res.length; i++) {
                            this.submitFileUpload(filesGroup[i], res[i].uploadUrl);
                            this.activityGuids.push(res[i].uploadGuid)
                        }
                });
        }
    }

    submitFileUpload(file: File, uploadUrl: string): void {
        const failedLocalValidator = this.getFailedLocalValidator(file);
        if (failedLocalValidator) {
            this.errorMessage = failedLocalValidator.result as string;
            this.componentBusy.emit(false);
            return;
        }

        if (this.uploadedFiles && this.uploadedFiles.length > 0) {
            this.openReuploadConfirmDialog(file, uploadUrl);
        } else {
            this.uploadFile(file, uploadUrl);
        }
    }

    openReuploadConfirmDialog(file: File, uploadUrl: string): void {
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
                this.uploadFile(file, uploadUrl);
            } else {
                this.componentBusy.emit(false);
            }
        });
    }

    undoUploadedFile(index): void {
        const config = this.modalDialogService.getDialogConfig(this.undoUploadButtonRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmUndoUploadTitle',
            confirmBtnText: 'SDK.FileUpload.OkBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText',
            confirmBtnColor: 'primary'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmUndo: boolean) => {
            console.log(confirmUndo, 'check it man')
            if (confirmUndo) {
                this.patchAnswer(null);
                this.setUploadedFile(undefined,index);
                this.fileNameToUpload = '';
            }
        });
    }

    cancelUpload(): void {
        const config = this.modalDialogService.getDialogConfig(this.cancelUploadingButtonRef, this.panelClass);
        config.data = {
            title: 'SDK.FileUpload.ConfirmCancelUploadTitle',
            confirmBtnText: 'SDK.FileUpload.OkBtnText',
            cancelBtnText: 'SDK.FileUpload.CancelBtnText',
            confirmBtnColor: 'primary'
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirm: boolean) => {
            if (confirm) {
                this.ngUnsubscribe.next();
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

    private uploadFile(file: File, uploadUrl: string): void {
        this.isLoading = true;
        this.fileNameToUpload = file?.name;

        this.fileUploadService.uploadFile(uploadUrl, file)
            .pipe(
                catchError(err => {
                    this.logger.logDebug('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe),
                finalize(() => {
                    this.componentBusy.emit(false);
                    this.isLoading = false;
                    this.fileNameToUpload = '';
                })
            )
            .subscribe(() => {
                const fileAnswer: ActivityFileAnswerDto = {
                    fileName: file?.name,
                    fileSize: file?.size,
                    fileMimeType: file?.type
                };
                console.log(fileAnswer, 'file answer')
                this.patchAnswer(fileAnswer, this.activityGuids);
                this.setUploadedFile(fileAnswer);
                console.log(this.fileNameToUpload, 'file to upload name')
                this.errorMessage = '';
            });
    }

    private setUploadedFile(file: ActivityFileAnswerDto, number?): void {
        number === undefined ? this.uploadedFiles.push(file) : this.uploadedFiles.splice(number, 1);
    }

    private patchAnswer(file: ActivityFileAnswerDto | null, fileUploadGuid?: string[]): void {
        this.block.answer = file || null;
        this.valueChanged.emit(fileUploadGuid || null);
    }

    private getFailedLocalValidator(file: File): ActivityFileValidationRule {
        return this.block.validators
            .filter(validator => validator instanceof ActivityFileValidationRule)
            .find(validator => {
                const preUploadFileAnswer: ActivityFileAnswerDto = {
                    fileName: file?.name,
                    fileSize: file?.size,
                    fileMimeType: file?.type
                };
                return !validator.recalculate(preUploadFileAnswer);
            }) as ActivityFileValidationRule;
    }
}
