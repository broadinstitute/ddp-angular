import { Injectable } from '@angular/core';
import { ActivityDefinition } from '../models/activity-definition.model';
import { ActivityData } from '../activity-data.model';
import { QuestionTypeModel} from '../models/question-type-models';
import { QuestionDefinition } from '../models/question-definition.model';
import { QuestionAnswer } from '../models/question-answer.model';
import {BuildingFactoryService} from './buildingFactory.service';

@Injectable()

export class buildActivityDataService {
    private activityQuestions: QuestionTypeModel[] = [];

    constructor(private buildingFactory: BuildingFactoryService) {}

    public buildActivity(activityDefinition: ActivityDefinition, activity: ActivityData): QuestionTypeModel[] {
      for(const answer of activity.questionsAnswers) {
        !([answer?.stableId, activityDefinition?.questions, activityDefinition.getQuestionDefinition(answer.stableId)]
          .includes(null)) && this.checkQuestionType(answer, activityDefinition.getQuestionDefinition(answer.stableId));
      }
      return this.activityQuestions;
    }

    private checkQuestionType(answer: QuestionAnswer, question: QuestionDefinition): void {
      const activityQuestion = this.buildingFactory.buildBlocks.find(x => x.type === question?.questionType);
      activityQuestion && this.activityQuestions.push(activityQuestion.func({answer, question}));
    }

}
