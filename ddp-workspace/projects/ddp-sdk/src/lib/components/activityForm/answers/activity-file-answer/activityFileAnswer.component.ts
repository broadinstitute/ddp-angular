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

import {EMPTY, forkJoin, Observable, Subject} from 'rxjs';
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
    uploadedFiles: ActivityFileAnswerDto[] | null = [];
    errorMessage: string;
    isLoading: boolean;
    private uploadFilesGuids: string[] = [];
    private ngUnsubscribe = new Subject<void>();
    private readonly panelClass = 'file-upload-confirm-dialog';

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService,
                private dialog: MatDialog,
                private modalDialogService: ModalDialogService) {
    }

    ngOnInit(): void {
        this.initUploadedFiles();
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
                    this.validateAndSubmitFileUpload(filesGroup, res);
                });
        }
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
            if (confirmUndo) {
                this.uploadFilesGuids.splice(index, 1);
                this.uploadedFiles.splice(index, 1);
                this.block?.answer?.splice(index, 1);
                this.patchAnswer(null, this.uploadFilesGuids);
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

    private prepareFileUploads(fileUploadRes: FileUploadResponse[], files: File[]): void {
        const fileUploadsArray: any[] = [];
        const fileUploadGuidsArray: string[] = [];
        fileUploadRes.forEach((upRes, i) => {
            fileUploadGuidsArray.push(upRes.uploadGuid);
            fileUploadsArray.push(this.fileUploadService.uploadFile(upRes.uploadUrl, files[i]));
        });

        this.startUploadingFiles(files, fileUploadsArray, fileUploadGuidsArray);
    }

    private validateAndSubmitFileUpload(files: File[], fileUploadRes: FileUploadResponse[]): void {
        const isValid = files.every(file => {
            const failedLocalValidator = this.getFailedLocalValidator(file);
            if (failedLocalValidator) {
                this.errorMessage = failedLocalValidator.result as string;
                this.componentBusy.emit(false);
                return false;
            }
            return true;
        });

        isValid && this.prepareFileUploads(fileUploadRes, files);
    }

    private initUploadedFiles(): void {
        if(this.block?.answer?.length > 0 && this.block?.answer[0] !== null) {
            this.block.answer && this.uploadedFiles.push(...this.block.answer);
            this.uploadFilesGuids = this.block.answer.map(fileAnswer => fileAnswer.uploadGuid);
        }
    }

    private startUploadingFiles(files: File[], fileUploadsArray: any[], guids: string[]): void {
        this.isLoading = true;

        forkJoin(fileUploadsArray)
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
                this.errorMessage = '';
                this.componentBusy.emit(false);
                this.isLoading = false;

                const uploadedFiles: ActivityFileAnswerDto[] = files.map((file, i) => ({
                        fileName: file?.name,
                        fileSize: file?.size,
                        fileMimeType: file?.type,
                        uploadGuid: this.uploadFilesGuids[i]
                    }));

                this.patchAnswer(uploadedFiles, guids);
            });
    }

    private patchAnswer(files: ActivityFileAnswerDto[] | null, guids: string[]): void {
        if(files !== null) {
            this.uploadedFiles.push(...files);
            this.uploadFilesGuids.push(...guids);
            this.block?.answer?.push(...files);
        }
        this.valueChanged.emit(this.uploadFilesGuids);
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
