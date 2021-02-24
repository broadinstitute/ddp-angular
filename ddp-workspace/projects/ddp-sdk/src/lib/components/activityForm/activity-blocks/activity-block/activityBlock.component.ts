import { Component, Input, OnInit } from '@angular/core';
import { ActivityActivityBlock } from '../../../../models/activity/activityActivityBlock';

@Component({
    selector: 'ddp-activity-block',
    templateUrl: './activity-block.component.html',
    styleUrls: ['./activity-block.component.scss']
})
export class ActivityBlockComponent implements OnInit {
    @Input() block: ActivityActivityBlock = {
        title: `<span>Title 123</span>`,
        instances: [1, 2, 3],
        addButtonText: 'My btn; ',
        allowMultiple: true
    } as any;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;

    ngOnInit(): void {
    }
}
