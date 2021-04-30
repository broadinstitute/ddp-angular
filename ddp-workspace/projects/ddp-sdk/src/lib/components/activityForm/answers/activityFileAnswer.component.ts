import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';

import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { FileUploadBody, FileUploadResponse } from '../../../models/fileUpload';
import { FileUploadService } from '../../../services/fileUpload.service';

@Component({
    selector: 'ddp-activity-file-answer',
    template: `
        <ddp-question-prompt [block]="block"></ddp-question-prompt>
        <div class="file-upload-content">
            <input type="file" class="file-input"
                   (change)="onFilesSelected($event.target.files)" #fileUpload>

            <div class="file-select">
                <div class="drop-block" dropFileToUpload (filesDropped)="onFilesSelected($event)">
                    <mat-icon class="upload-icon" color="primary">file_upload</mat-icon>
                    <span class="drop-block-text">Drag files to upload</span>
                </div>
                <button mat-raised-button color="primary" class="upload-btn"
                        (click)="fileUpload.click()">Choose file
                    <mat-icon>attach_file</mat-icon>
                </button>

            </div>
            <div class="file-info">
                <span class="file-name">{{file?.name || 'No file uploaded'}}</span>
            </div>
        </div>

        <button mat-raised-button color="primary"
                class="submit-btn"
                [disabled]="!isFileSelected"
                (click)="uploadFile()"
        >Submit
        </button>
    `,
    styles: [
        `.file-upload-content {
            display: flex;
        }

        .file-select {
            text-align: center;
        }

        .drop-block {
            width: 200px;
            height: 150px;
            border: 1px dashed grey;
            border-radius: 10px;
            background-color: whitesmoke;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .drop-block.file-over {
            background-color: lightyellow;
        }

        .upload-icon {
            font-size: 48px;
            width: auto;
            height: auto;
        }

        .upload-btn {
            margin: 20px 0;
        }

        .file-info {
            padding: 10px 20px;
        }

        .file-input {
            display: none;
        }

        .submit-btn {
            margin: 20px 0;
            float: right;
        }
        `
    ]
})
export class ActivityFileAnswer implements OnDestroy {
    @Input() block: ActivityTextQuestionBlock;
    @Input() readonly: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();

    file: File;
    fileUploadData: FileUploadResponse;
    isFileSelected: boolean;
    private ngUnsubscribe = new Subject();

    constructor(private fileUploadService: FileUploadService) {
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
                // resumable: false
            };

            this.fileUploadService.getUploadUrl(this.studyGuid, this.activityGuid, requestBody)
                .pipe(
                    catchError(err => {
                        console.log('ActivityFileAnswer getUploadUrl error:', err);
                        return EMPTY;
                    }),
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe((res: FileUploadResponse) => {
                    console.log('FileUploadResponse:', res);
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
                    console.log('ActivityFileAnswer uploadFile error:', err);
                    return EMPTY;
                }),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((res) => {
                console.log('uploadFile success', res);
                this.valueChanged.emit(this.fileUploadData.uploadGuid);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
