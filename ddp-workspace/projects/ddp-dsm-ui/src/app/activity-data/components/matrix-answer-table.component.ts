import {Component, Input} from '@angular/core';
import {QuestionDefinition, Row} from '../models/question-definition.model';
import {MatrixAnswer} from '../models/question-type-models';
import {Option} from '../models/option.model';

@Component({
  selector: 'app-matrix-answer-table',
  templateUrl: './matrix-answer.table.component.html',
  styleUrls: ['./matrix-answer.table.component.scss'],
})
export class MatrixAnswerTableComponent {
  @Input() answers: MatrixAnswer[];
  @Input() questionDefinition!: QuestionDefinition;

  public isChecked(optionId: string, rowId: string): boolean {
    const checkedAnswerIndex = this.answers
      .findIndex(answer => answer.horizontalAnswer?.optionStableId === optionId && answer.verticalAnswer?.rowStableId === rowId);
    return checkedAnswerIndex > -1;
  }

  public get columns(): Option[]  {
    return this.questionDefinition.options;
  }

  public get rows(): Row[] {
    return this.questionDefinition.rows;
  }

}
