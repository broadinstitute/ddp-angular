import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivityContentBlock } from '../../../models/activity/activityContentBlock';
import {ActivityQuestionBlock} from '../../../models/activity/activityQuestionBlock';
import {ActivitySection} from '../../../models/activity/activitySection';
import {FileDownloadService} from '../../../services/fileDownload.service';
import {catchError, finalize, pluck} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {BlockType} from '../../../models/activity/blockType';

@Component({
    selector: 'ddp-activity-content',
    template: `
    <div *ngIf="block.title" [innerHTML]="sanitizer.bypassSecurityTrustHtml(block.title)"></div>
    <div class="ddp-content" [innerHTML]="sanitizedContent"></div>

<!--    Button for Result File Download-->
    <ng-container *ngIf="shouldDisplayDownloadButton">
        <ddp-download-file [isError]="isErrorButton"
                           [isLoading]="isLoadingButton"
                           [btnText]="'Download Results'"
                           (btnClicked)="downloadPDF()">

            <p *ngIf="isErrorButton">This file is not available. Please contact the study team at
                <a class="Link" [href]="'mailTo:info@' + studyName +'project.org'">
                    {{'info@'+ studyName + 'project.org'}}</a> or
                <a class="Link" href="tel:651-403-5556">651-403-5556</a>
                if you have any questions.
            </p>

        </ddp-download-file>
    </ng-container>
    `,
})
export class ActivityContentComponent implements OnInit, OnChanges, OnDestroy {
    public sanitizedContent: SafeHtml;
    public isLoadingButton = false;
    public isErrorButton = false;

    private fileDownloadSubscription: Subscription;

    @Input() block: ActivityContentBlock;
    @Input() section: ActivitySection;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Input() activityCode: string;
    @Input() activityStatusCode: string;

    @Output() componentBusy = new EventEmitter<boolean>(true);


    constructor(public sanitizer: DomSanitizer,
                private fileDownloadService: FileDownloadService) {}

    ngOnInit(): void {
        this.sanitizeContent();
    }

    ngOnChanges(): void {
        this.sanitizeContent();
    }

    ngOnDestroy(): void {
        this.fileDownloadSubscription?.unsubscribe();
    }

    public get studyName(): string {
        let studyName: string;
        switch (this.studyGuid.toLowerCase()) {
            case 'cmi-osteo':
                studyName = 'osteo';
                break;
            case 'cmi-lms':
                studyName = 'lms';
                break;
            default:
                throw new Error(`The name is not available fot ${this.studyGuid} study guid`)
        }
        return studyName;
    }

    /**
     *  PDF download for the SOMATIC_RESULTS activity
     */
    public downloadPDF(): void {
        this.isLoadingButton = true;
        this.componentBusy.emit(true);
        this.fileDownloadSubscription = this.fileDownloadService
            .getDownloadUrl(this.studyGuid, this.activityGuid,'RESULT_FILE').pipe(
                pluck('downloadUrl'),
                catchError((error) => {
                    this.isErrorButton = true;
                    return throwError(() => error);
                }),
                finalize(() => {
                    this.componentBusy.emit(false);
                    this.isLoadingButton = false;
                })
            )
            .subscribe({
                next: (downloadUrl) => this.openPDF(downloadUrl),
                error: error => console.log(error, 'ERROR')
            });
    }

    public get shouldDisplayDownloadButton(): boolean {
        const showResultsBlock: ActivityQuestionBlock<any> = this.section.blocks
            .find(block => block.blockType === BlockType.Question) as ActivityQuestionBlock<any>;

        return this.activityCode === 'SOMATIC_RESULTS' && this.activityStatusCode === 'COMPLETE' &&
            !!showResultsBlock && showResultsBlock.stableId === 'SHOW_RESULTS' && showResultsBlock.answer === true;
    }

    private openPDF(pdfUrl: string): void {
        try {
            const anchorElement = document.createElement('a');
            const splitUrl = pdfUrl.split('/');
            anchorElement.href = pdfUrl;
            anchorElement.download = splitUrl[splitUrl.length - 1];
            anchorElement.target = '_blank';
            anchorElement.click();
        } catch (e: any) {
            window.open(pdfUrl, '_blank');
        }
    }

    private sanitizeContent(): void {
        // only update content on changes and on init to avoid unnecessary rerenders which
        // cause html elements (e.g. `details`) to be recreated that resets their existing (opened/closed) state
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.block.content || '');
    }
}
