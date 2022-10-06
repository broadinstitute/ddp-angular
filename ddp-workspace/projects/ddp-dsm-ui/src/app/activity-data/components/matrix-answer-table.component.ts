import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {QuestionDefinition, Row} from "../models/question-definition.model";
import {Option} from "../models/option.model";
import {MatrixAnswer} from "../models/question-type-models";

@Component({
  selector: 'matrix-answer-table',
  templateUrl: './matrix-answer.table.component.html',
  styleUrls: ['./matrix-answer.table.component.scss'],
})
export class MatrixAnswerTableComponent {
  @Input() answers: MatrixAnswer[] = [];
  @Input() questionDefinition!: QuestionDefinition;

  constructor() {
  }


  public isChecked(optionId: string, rowId: string): boolean {
    const checkedAnswerIndex = this.answers
      .findIndex(answer => answer.horizontalAnswer?.optionStableId === optionId && answer.verticalAnswer?.rowStableId === rowId)
    return checkedAnswerIndex > -1;
  }

}
