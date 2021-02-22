import { Component, Input } from '@angular/core';
import { ActivityContentBlock } from '../../models/activity/activityContentBlock';

@Component({
    selector: 'ddp-activity-content',
    template: `
    <div *ngIf="block.title" [innerHTML]="block.title"></div>
    <div class="ddp-content" [innerHTML]="block.content"></div>`
})
export class ActivityContentComponent {
    @Input() block: ActivityContentBlock;
}
