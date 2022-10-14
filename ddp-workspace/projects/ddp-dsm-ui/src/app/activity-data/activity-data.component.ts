import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ActivityData} from './activity-data.model';
import {ActivityDefinition} from './models/activity-definition.model';
import {buildActivityDataService} from './services/buildActivityData.service';
import {QuestionTypeModel} from './models/question-type-models';
import {QuestionDefinition} from './models/question-definition.model';

@Component({
  selector: 'app-activity-data',
  templateUrl: './activity-data.component.html',
  styleUrls: [ './activity-data.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [buildActivityDataService]
})
export class ActivityDataComponent {
  @Input() activity: ActivityData;
  @Input() activityDefinition: ActivityDefinition;
  @Input() openActivity: string;

  public questionsAndAnswers: QuestionTypeModel[];

  constructor(private ActDataBuilderService: buildActivityDataService) {
  }

  generateActivity(): void {
    if(!this.questionsAndAnswers) {
      this.questionsAndAnswers = this.ActDataBuilderService
        .buildActivity(this.activityDefinition, this.activity);
    }
  }

  public matrixQuestionDefinition(stableId: string): QuestionDefinition {
    return this.activityDefinition.questions.find((question) => question.stableId === stableId);
  }

}
