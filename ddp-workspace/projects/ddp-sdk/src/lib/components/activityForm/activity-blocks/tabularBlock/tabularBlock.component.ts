import { Component, Input, OnInit } from '@angular/core';

import { AnswerValue } from '../../../../models/activity/answerValue';
import { ActivityTabularBlock } from '../../../../models/activity/activityTabularBlock';

interface TabularHeader {
    label: string;
    gridColumn: string;
}

@Component({
    selector: 'ddp-tabular-block',
    templateUrl: './tabularBlock.component.html',
    styleUrls: ['./tabularBlock.component.scss']
})
export class TabularBlockComponent implements OnInit {
    @Input() block: ActivityTabularBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    headers: TabularHeader[] = [];
    gridSettings: { [setting: string]: string } = {};

    // local counter to set correct gridColumn value for tabular questions
    private counterInRow = 0;
    private currentRowNumber: number;

    ngOnInit(): void {
        console.log('Tabular init', this.block);

        this.gridSettings = {
            gridTemplateColumns: '1fr '.repeat(this.block.numberOfColumns).trim(),
        };

        // this.columnIndexes = Array(this.block.numberOfColumns).fill('').map((value, index) => index);

        this.headers = this.block.headers.map(header => ({
            label: header.label,
            gridColumn: `${header.startColumn} / ${header.endColumn}`
        }));
    }

    handleChange(value: AnswerValue): void {
        console.log('Tabular value changed', value);
    }

    increaseCounter(row): any {
        if (row !== this.currentRowNumber) {
            this.currentRowNumber = row;
            this.counterInRow = 0;
        }
        this.counterInRow++;

        return this.counterInRow;
    }
}
