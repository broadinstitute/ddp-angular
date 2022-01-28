import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityContentBlock } from '../../../models/activity/activityContentBlock';

@Component({
    selector: 'ddp-activity-content',
    template: `
    <div *ngIf="block.title" [innerHTML]="sanitizer.bypassSecurityTrustHtml(block.title)"></div>
    <div class="ddp-content" [innerHTML]="sanitizer.bypassSecurityTrustHtml(block.content || '')"></div>`
})
export class ActivityContentComponent {
    @Input() block: ActivityContentBlock;
    constructor(public sanitizer: DomSanitizer) {}
}
