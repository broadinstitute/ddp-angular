import {Injectable} from '@angular/core';
import {QuestionTypeEnum} from '../enums/questionType.enum';
import {QuestionAnswer} from '../models/question-answer.model';
import {QuestionDefinition, Row} from '../models/question-definition.model';
import {MatrixAnswer, QuestionTypeModel} from '../models/question-type-models';
import {SectionModeEnum} from '../enums/sectionMode.enum';
import {Utils} from '../../utils/utils';
import {ActivityRule} from '../models/activity-rule';
import {Option} from '../models/option.model';

@Injectable()
export class BuildingFactoryService {

  public buildBlocks: Array<ActivityRule>;

  constructor(private util: Utils) {
    this.insertBuildingBlocks();
  }

  private insertBuildingBlocks(): void {
    this.buildBlocks = [
      {
        type: QuestionTypeEnum.Text,
        func: (input) => this.generateTextQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Numeric,
        func: (input) => this.generateNumericQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Decimal,
        func: (input) => this.generateNumericQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Date,
        func: (input) => this.generateDateQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Boolean,
        func: (input) => this.generateBooleanQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Agreement,
        func: (input) => this.generateAgreementQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Composite,
        func: (input) => this.generateCompositeQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Picklist,
        func: (input) => this.generatePicklistQuestion(input.answer, input.question)
      },
      {
        type: QuestionTypeEnum.Matrix,
        func: (input) => this.generateMatrixQuestion(input.answer, input.question)
      }
    ];
  }

  /* Generating question according to its own type */

  // TEXT
  private generateTextQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      answer: answer.answer
    };
  }

  // Numeric
  private generateNumericQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      answer: answer.answer
    };
  }

  // Date
  private generateDateQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      answer: answer.date
    };
  }

  // Boolean
  private generateBooleanQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      answer: this.util.getYesNo(answer.answer)
    };
  }

  // Agreement
  private generateAgreementQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      answer: this.util.getYesNo(answer.answer)
    };
  }

  // Composite
  private generateCompositeQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    const compositeAnswer = [];

    answer.answer.forEach(compAnswer => {
      question.childQuestions.forEach((childQuestion, index) => {
        const endQuestion = childQuestion.questionText;
        let endAnswer;

        switch (childQuestion.questionType) {
          case QuestionTypeEnum.Date:
            endAnswer = this.getNiceUserText(compAnswer[index]);
            break;
          case QuestionTypeEnum.Picklist:
            endAnswer = this.getOptionOrGroupText(childQuestion, compAnswer[index]);
            break;
          default:
            endAnswer = this.getNiceUserText(compAnswer[index]);
        }
        compositeAnswer.push({question: endQuestion, answer: endAnswer});
      });
    });

    return {
      type: question.questionType,
      question: question.questionText,
      stableId: answer.stableId,
      compositeAnswer: compositeAnswer
    };
  }


  // Picklist
  private generatePicklistQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    const picklistAnswers = {
      multiple: question.selectMode === SectionModeEnum.Multiple ? this.picklistMultiple(answer, question) : undefined,
      single: question.selectMode === SectionModeEnum.Single ? this.picklistSingle(answer, question) : undefined
    };
    return {
      type: question.questionType,
      question: question.questionText,
      stableId: answer.stableId,
      picklistAnswer: picklistAnswers
    };
  }

  private picklistMultiple(answer: QuestionAnswer, question: QuestionDefinition): any {
    const picklistOptions = [];
    const picklistGroups = [];

    // Options
    if(question.options !== null) {
      const optionsObject = {};
      for(const o of question.options) {
        //  options and details
        if(this.util.isOptionSelected(answer.answer, o.optionStableId)) {
          optionsObject['text'] = o.optionText;
          optionsObject['details'] = Utils.getOptionDetails(answer.optionDetails, o.optionStableId)?.details;
          // Nested options
          if(answer.nestedOptions != null && o.nestedOptions !== null && answer.nestedOptions[o.optionStableId]) {
            optionsObject['nText'] = [];
            for(const nOption of answer.nestedOptions[o.optionStableId]) {
              optionsObject['nText'].push(this.util.getAnswerText(nOption, o.nestedOptions).optionText);
            }
          } else {
            optionsObject['nText'] = undefined;
          }
          picklistOptions.push({...optionsObject});
        }
      }
    }

    // Groups
    if(question.groups !== null && answer.answer !== null) {
      const groupsObject = {};
      for(const group of question.groups) {
        if(this.util.isGroupSelected(answer.answer, group)) {
          groupsObject['text'] = group.groupText;
          if(answer.groupedOptions[group.groupStableId]) {
            groupsObject['details'] = [];
            for(const gAnswer of answer.groupedOptions[group.groupStableId]) {
              if(this.util.getAnswerText(gAnswer, group.options)) {
                groupsObject['details'].push(this.util.getAnswerText(gAnswer, group.options));
                groupsObject['optionText'] = Utils.getOptionDetails(answer.optionDetails, gAnswer);
              }
            }
          } else {
            groupsObject['details'] = undefined;
            groupsObject['optionText'] = undefined;
          }
          picklistGroups.push({...groupsObject});
        }
      }

    }

    return {groups: picklistGroups, options: picklistOptions};
  }

  private picklistSingle(answer: QuestionAnswer, question: QuestionDefinition): any {
    const picklistOptions = [];

    if(this.getCorrectTextAsAnswer(answer)) {
      const optionsObject = {};
      for(const an of this.getCorrectTextAsAnswer(answer)) {
        optionsObject['text'] = Utils.getAnswerGroupOrOptionText(an, question);
        optionsObject['details'] = Utils.getOptionDetails(answer.optionDetails, an);
      }
      picklistOptions.push({...optionsObject});
    }

    return picklistOptions;
  }


  // Matrix
  private generateMatrixQuestion(answer: QuestionAnswer, question: QuestionDefinition): QuestionTypeModel {
    return {
      type: question.questionType,
      stableId: answer.stableId,
      question: question.questionText,
      matrixAnswer: this.getMatrix(answer, question)
    };
  }


  /* LOCAL UTILS */

  private getNiceUserText(text: string): string {
    if (text != null && text.indexOf('-null') > -1) {
      return text.replace('-null', '').replace('-null', '');
    }
    return text;
  }

  private getOptionOrGroupText(questionDefinition: QuestionDefinition, stableId: string): string {
    const composedStableId = stableId?.includes('|') ? stableId?.split('|')[0] : stableId;
    if (questionDefinition.options) {
      const option = questionDefinition.options.find(x => x.optionStableId === composedStableId);
      if (option != null) {
        return stableId?.includes('|') ? stableId?.split('|')[1] : option.optionText;
      }
    }
    if (questionDefinition.groups) {
      let text = '';
      questionDefinition.groups.find(g => {
        if (g.options) {
          const option = g.options.find(o => o.optionStableId === stableId);
          if (option) {
            text = option.optionText;
            return true;
          }
        }
        return false;
      });
      return text;
    }
    return '';
  }

  private getCorrectTextAsAnswer(questionAnswer: QuestionAnswer ): any[] {
    const answers = [];
    for (const answer of questionAnswer.answer) {
      answers.push( answer );
    }
    return answers;
  }

  private getMatrix(selectedAnswers: Object, questDef: Object): MatrixAnswer[] {
    return Object.entries(selectedAnswers['matrixSelected']).map(([questionId, answerId]): MatrixAnswer => ({
        verticalAnswer: this.getMatrixVerticalAnswer(questionId, questDef['rows']),
        horizontalAnswer: this.getMatrixHorizontalAnswer((answerId as string), questDef['options']),
      }));
  }

  private getMatrixVerticalAnswer(questionId: string, rows: Row[]): Row {
    return rows.find(question => question['rowStableId'] === questionId);
  }

  private getMatrixHorizontalAnswer(answerId: string, options: Option[]): Option {
    return options.find(answer => answer['optionStableId'] === answerId);
  }
}
