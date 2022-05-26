import { Component, Input, OnInit } from '@angular/core';

import { AnswerValue } from '../../../../models/activity/answerValue';
import { ActivityTabularBlock } from '../../../../models/activity/activityTabularBlock';
import { LayoutType } from '../../../../models/layout/layoutType';
import { ActivityQuestionBlock } from 'ddp-sdk';

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
    readonly LayoutType = LayoutType;
    @Input() block: ActivityTabularBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    headers: TabularHeader[] = [];
    gridSettings: { [setting: string]: string } = {};

    ngOnInit(): void {
        console.log('Tabular init', this.block);

        this.gridSettings = {
            gridTemplateColumns: 'auto '.repeat(this.block.numberOfColumns).trim(),
        };

        this.headers = this.block.headers.map(header => ({
            label: header.label,
            gridColumn: `span ${header.columnSpan}`
        }));
    }

    isEvenRow(questionIndex: number): boolean {
        return this.isEven(this.numberOfGridCellsBefore(questionIndex));
    }

    // The index of the child is zero-based, but to calculate "even" we consider first row of table/grid "1"
    private isEven(gridChildZeroBasedIndex: number): boolean {
       return (Math.floor(gridChildZeroBasedIndex / this.block.numberOfColumns) + 1) % 2 === 0;
    }

    // grid layout child element zero-based index for question with given index
    private numberOfGridCellsBefore(questionIndex: number): number {
        const total =  this.block.content.slice(0, questionIndex) // all the questions before this one
            .map(question => question.columnSpan) // columnSpan for them
            .reduce((previousTotal, columnsThisQuestion) => previousTotal + columnsThisQuestion, 0); //total them
        return total;
    }

    questionFieldsSpan(questionBlock: ActivityQuestionBlock<any>): string {
        // we subtract the column for the question prompt if there is one
        return 'span ' + (questionBlock.columnSpan - (questionBlock.question ? 1 : 0));
    }

}
