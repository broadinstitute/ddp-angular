import { Injectable } from '@angular/core';
import { ActivityDefinition } from '../models/activity-definition.model';
import { ActivityData } from '../activity-data.model';
import {MatrixAnswer, QuestionTypeModel} from '../models/question-type-models';
import { QuestionDefinition } from '../models/question-definition.model';
import { QuestionAnswer } from '../models/question-answer.model';
import { BuildingFactoryService } from './buildingFactory.service';
import {QuestionTypeEnum} from '../enums/questionType.enum';

@Injectable()

export class buildActivityDataService {
    private activityQuestions: QuestionTypeModel[] = [];

    constructor(private buildingFactory: BuildingFactoryService) {}

    public buildActivity(activityDefinition: ActivityDefinition, activity: ActivityData): QuestionTypeModel[] {
      activityDefinition?.questions.forEach(question => {
        const questionAnswer = activity.searchForAnswerByStableId(question.stableId);

        questionAnswer?.stableId ? this.checkQuestionType(questionAnswer, question)
          : this.activityQuestions.push(this.buildNoAnswer(question));
      });

      return this.activityQuestions;
    }

    private checkQuestionType(answer: QuestionAnswer, question: QuestionDefinition): void {
      const activityQuestion = this.buildingFactory.buildBlocks.find(x => x.type === question?.questionType);
      activityQuestion && this.activityQuestions.push(activityQuestion.func({answer, question}));
    }

    private buildNoAnswer(question: QuestionDefinition): QuestionTypeModel {
      const noAnswerObj: QuestionTypeModel = {
        type: '',
        stableId: question.stableId,
        question: question.questionText,
      };
      if(question.questionType === QuestionTypeEnum.Matrix) {
        noAnswerObj.type = QuestionTypeEnum.Matrix;
        noAnswerObj.matrixAnswer = this.generateDefaultMatrixAnswers(question);
      }
      return noAnswerObj;
    }

    private generateDefaultMatrixAnswers(question: QuestionDefinition): MatrixAnswer[] {
      const matrixAnswer: MatrixAnswer[] = [];
      question.rows.forEach(row => {
        const mAnswer: MatrixAnswer = {
          verticalAnswer: row,
          horizontalAnswer: null
        };
        matrixAnswer.push(mAnswer);
      });
      return matrixAnswer;
    }

}
