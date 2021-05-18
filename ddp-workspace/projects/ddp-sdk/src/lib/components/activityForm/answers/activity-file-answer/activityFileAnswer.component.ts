import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UploadFile } from '../../../../models/uploadFile';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';
import { ActivityFileAnswerDto } from '../../../../models/activity/activityFileAnswerDto';
import { FileUploadBody } from '../../../../models/fileUploadBody';
import { FileUploadResponse } from '../../../../models/fileUploadResponse';

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

    selectedFile: File;
    isFileSelected: boolean;
    uploadedFile: UploadFile | null;
    private fileToUpload: UploadFile | null;
    private ngUnsubscribe = new Subject();

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService) {
    }

    ngOnInit(): void {
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
                        isUploaded: false
                    };
                });
        }
    }

    uploadFile(): void {
        // TODO: add confirm dialog "Are you sure to replace?" if there is already `this.uploadedFile`

        this.fileUploadService.uploadFile(this.fileToUpload.uploadUrl, this.selectedFile)
            .pipe(
                catchError(err => {
                    this.logger.logDebug('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((res) => {
                this.patchAnswer(this.fileToUpload);
                // check if ok ^, then =>
                this.setUploadedFile({
                    ...this.fileToUpload,
                    isUploaded: true
                });
                this.resetSelectedFile();
            });
    }

    removeUploadedFile(): void {
        // TODO: add confirm dialog "Are you sure to remove (undo uploading)?"
        this.patchAnswer(null);
        // check if ok ^, then =>
        this.setUploadedFile(null);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private initUploadedFile(): void {
        if (this.block?.answer) {
            this.setUploadedFile({
                uploadGuid: '',
                uploadUrl: ',',
                name: this.block.answer.fileName,
                size: this.block.answer.fileSize,
                isUploaded: true
            } as UploadFile);
        }
    }

    private setUploadedFile(file: UploadFile | null): void {
        this.uploadedFile = file;
    }

    private patchAnswer(file: UploadFile | null): void {
        this.block.answer = file ? { fileName: file.name, fileSize: file.size } as ActivityFileAnswerDto : null;
        this.valueChanged.emit(file?.uploadGuid || null);
    }

    private resetSelectedFile(): void {
        this.selectedFile = null;
        this.isFileSelected = false;
    }
}
