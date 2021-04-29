import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { FileUploadBody, FileUploadResponse } from '../../../models/fileUpload';
import { FileUploadService } from '../../../services/fileUpload.service';

@Component({
    selector: 'ddp-activity-file-answer',
    template: `
        <ddp-question-prompt [block]="block"></ddp-question-prompt>
        <div class="file-upload-content">
            <input type="file" class="file-input"
                   (change)="onFileSelected($event)" #fileUpload>

            <div class="file-select">
                <div class="drop-block">
                    <mat-icon class="upload-icon" color="primary">file_upload</mat-icon>
                    <span class="drop-block-text">Drag files to upload</span>
                </div>
                <button mat-raised-button color="primary" class="upload-btn"
                        (click)="fileUpload.click()">Choose file
                    <mat-icon>attach_file</mat-icon>
                </button>

            </div>
            <div class="file-info">
                <span class="file-name">{{fileName}}</span>
            </div>
        </div>

        <button mat-raised-button color="primary" class="submit-btn">Submit
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
            background-color: lightyellow;
            display: flex;
            flex-direction: column;
            justify-content: center;
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
export class ActivityFileAnswer implements OnInit, OnDestroy {
    @Input() block: ActivityTextQuestionBlock;
    @Input() readonly: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();

    fileName = 'No file uploaded';
    private subscription: Subscription;

    constructor(private fileUploadService: FileUploadService) {
    }

    onFileSelected(event): void {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;

            const requestBody: FileUploadBody = {
                questionStableId: this.block.stableId,
                fileName: file.name,
                fileSize: file.size,
                // mimeType: "application/octet-stream",
                resumable: true

            };
            this.subscription = this.fileUploadService.getUploadUrl(this.studyGuid, this.activityGuid, requestBody)
                .pipe(
                    catchError(err => {
                        console.log('ActivityFileAnswer error:', err);
                        return EMPTY;
                    })
                )
                .subscribe((res: FileUploadResponse) => {
                    console.log('FileUploadResponse:', res);
                });
        }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
