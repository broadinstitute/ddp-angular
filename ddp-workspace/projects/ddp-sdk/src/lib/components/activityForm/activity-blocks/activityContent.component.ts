import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivityContentBlock } from '../../../models/activity/activityContentBlock';
import {ActivityQuestionBlock} from "../../../models/activity/activityQuestionBlock";
import {ActivitySection} from "../../../models/activity/activitySection";
import {FileDownloadService} from "../../../services/fileDownload.service";
import {pluck} from "rxjs/operators";
import {Observable} from "rxjs";
import {BlockType} from "../../../models/activity/blockType";

@Component({
    selector: 'ddp-activity-content',
    template: `
    <div *ngIf="block.title" [innerHTML]="sanitizer.bypassSecurityTrustHtml(block.title)"></div>
    <div class="ddp-content" [innerHTML]="sanitizedContent"></div>

    <ng-container *ngIf="shouldDisplayDownloadButton">
        <ddp-download-file [downloadURL]="downloadUrl$ | async"></ddp-download-file>
    </ng-container>
    `
})
export class ActivityContentComponent implements OnInit, OnChanges {
    @Input() block: ActivityContentBlock;
    @Input() section: ActivitySection;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Input() activityCode: string;
    @Input() activityStatusCode: string;

    public downloadUrl$: Observable<any>;
    public sanitizedContent: SafeHtml;

    constructor(public sanitizer: DomSanitizer,
                private fileDownloadService: FileDownloadService) {}

    ngOnInit(): void {
        this.sanitizeContent();
        this.downloadUrl$ = this.fileDownloadService
            .getDownloadUrl(this.studyGuid, this.activityGuid, 'RESULT_FILE')
            .pipe(pluck('downloadUrl'));
    }

    ngOnChanges(): void {
        this.sanitizeContent();
    }

    public get shouldDisplayDownloadButton(): boolean {
        const showResultsBlock: ActivityQuestionBlock<any> = this.section.blocks
            .find(block => block.blockType === BlockType.Question) as ActivityQuestionBlock<any>;
        return !!showResultsBlock && showResultsBlock.stableId === 'SHOW_RESULTS' &&
            showResultsBlock.answer === true && this.activityCode === 'SOMATIC_RESULTS' &&
            this.activityStatusCode === 'COMPLETE';
    }

    private sanitizeContent(): void {
        // only update content on changes and on init to avoid unnecessary rerenders which
        // cause html elements (e.g. `details`) to be recreated that resets their existing (opened/closed) state
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.block.content || '');
    }
}
