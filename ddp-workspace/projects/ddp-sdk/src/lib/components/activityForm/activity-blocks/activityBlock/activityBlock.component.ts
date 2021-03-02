import { Component, Input, OnInit } from '@angular/core';
import { ActivityActivityBlock } from '../../../../models/activity/activityActivityBlock';

const DEBUG_DATA = {
    title: `<span>Title 123</span>`,
    instances: [1, 2, 3],
    addButtonText: 'Add sibling or half-sibling',
    allowMultiple: true
} as any;

@Component({
    selector: 'ddp-activity-block',
    templateUrl: './activityBlock.component.html',
    styleUrls: ['./activityBlock.component.scss']
})
export class ActivityBlockComponent implements OnInit {
    @Input() block: ActivityActivityBlock = DEBUG_DATA;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;

    ngOnInit(): void {
    }
}
