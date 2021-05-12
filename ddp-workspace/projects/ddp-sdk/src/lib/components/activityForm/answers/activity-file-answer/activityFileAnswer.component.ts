import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { FileUploadBody, FileUploadResponse } from '../../../../models/fileUpload';
import { ActivityFileQuestionBlock } from '../../../../models/activity/activityFileQuestionBlock';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { LoggingService } from '../../../../services/logging.service';

@Component({
    selector: 'ddp-activity-file-answer',
    templateUrl: 'activityFileAnswer.component.html',
    styleUrls: ['activityFileAnswer.component.scss']
})
export class ActivityFileAnswer implements OnDestroy {
    @Input() block: ActivityFileQuestionBlock;
    @Input() readonly: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();

    file: File;
    fileUploadData: FileUploadResponse;
    isFileSelected: boolean;
    private ngUnsubscribe = new Subject();

    constructor(private fileUploadService: FileUploadService,
                private logger: LoggingService) {
    }

    onFilesSelected(files: File[]): void {
        const file: File = files[0];

        if (file) {
            this.file = file;

            const requestBody: FileUploadBody = {
                questionStableId: this.block.stableId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type
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
                    this.fileUploadData = res;
                });
        }
    }

    uploadFile(): void {
        const formData = new FormData();
        formData.append('file', this.file);

        this.fileUploadService.uploadFile(this.fileUploadData.uploadUrl, formData, this.file.type)
            .pipe(
                catchError(err => {
                    this.logger.logDebug('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((res) => {
                this.block.answer = this.fileUploadData.uploadGuid;
                this.valueChanged.emit(this.fileUploadData.uploadGuid);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
