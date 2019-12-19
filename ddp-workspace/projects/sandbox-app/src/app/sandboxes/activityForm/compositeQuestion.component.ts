import { Component, OnInit } from '@angular/core';
import { QuestionComponent } from './questionComponent';
import {
  ActivityCompositeQuestionBlock,
  ActivityQuestionBlock,
  ActivityPicklistQuestionBlock,
  ActivityBooleanQuestionBlock,
  ActivityTextQuestionBlock,
  ActivityDateQuestionBlock,
  DateRenderMode,
  ActivityAgreementQuestionBlock
} from 'ddp-sdk';

interface ActivityRule {
  type: string;
  func: any;
}

@Component({
  selector: 'app-sandbox-composite-question',
  templateUrl: 'compositeQuestion.component.html'
})
export class CompositeQuestionComponent extends QuestionComponent<ActivityCompositeQuestionBlock> implements OnInit {

  private questionRules: ActivityRule[];

  constructor() {
    super();
    this.initializeQuestionRules();

    this.inputParameters = `{
  "shown": true,
  "allowMultiple": true,
  "questionType": "COMPOSITE",
  "stableId": "COMP_1",
  "html": "The Parent Question",
  "addButtonText": "Add Another Disease",
  "additionalItemText": "And another one...",
  "children": [
    {
      "inputType": "TEXT",
      "label": "Disease",
      "placeholder": "Flu, Gout, Cancer, etc...",
      "shown": true,
      "questionType": "TEXT",
      "stableId": "CHILD_TEXT1",
      "answers": [

      ],
      "validations": [
        {
          "minLength": 5,
          "maxLength": 300,
          "rule": "LENGTH",
          "message": "The answer length requirement is not met."
        },
        {
          "regexPattern": "[A-Z]*",
          "rule": "REGEX",
          "message": "regex hint"
        }
      ]
    },
    {
      "renderMode": "PICKLIST",
      "label": "When?",
      "displayCalendar": false,
      "placeholder": "Year",
      "fields": [
        "YEAR",
        "MONTH",
        "DAY"
      ],
      "questionType": "DATE",
      "shown": true,
      "stableId": "CHILD_DATE1",
      "answers": [

      ],
      "validations": [

      ]
    },
    {
      "renderMode": "TEXT",
      "label": "Why?",
      "displayCalendar": false,
      "fields": [
        "MONTH",
        "DAY",
        "YEAR"
      ],
      "questionType": "DATE",
      "shown": true,
      "stableId": "CHILD_DATE2",
      "answers": [

      ],
      "validations": [

      ]
    },
 {
      "renderMode": "SINGLE_TEXT",
      "label": "Who?",
      "displayCalendar": true,
      "fields": [
        "MONTH",
        "DAY",
        "YEAR"
      ],
      "questionType": "DATE",
      "shown": true,
      "stableId": "CHILD_DATE3",
      "answers": [

      ],
      "validations": [

      ]
    }
  ],
  "answers": [

  ],
  "validations": [

  ]
}`;

  }

  ngOnInit(): void {
    this.update();
  }

  public update(): void {
    try {
      this.readonly = false;
      const newQuestion = this.buildQuestionBlock(JSON.parse(this.inputParameters));
      if (newQuestion && newQuestion instanceof ActivityCompositeQuestionBlock) {
        this.question = newQuestion as ActivityCompositeQuestionBlock;
      }
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }

  private buildQuestionBlock(question: any): ActivityQuestionBlock<any> | null {
    let questionBlock: ActivityQuestionBlock<any>;
    const block = this.questionRules.find(x => x.type === question.questionType);
    if (block) {
      questionBlock = block.func(question);
    } else {
      // TODO throw an Exception here?
      console.warn(`Received question of type ${question.questionType} that we do not know how to handle`);
      return null;
    }
    questionBlock.question = question.question;
    questionBlock.label = question.label;
    questionBlock.stableId = question.stableId;
    // very important!!!! (even though technically part of question)
    questionBlock.shown = question.shown;
    // questionBlock.validators = this.validatorBuilder.buildQuestionValidatorRule(inputBlock, questionBlock);
    if (question.childQuestionBlocks && question.childQuestionBlocks.length > 0) {
      if (question.questionType === 'PICKLIST') {
        const picklist = questionBlock as ActivityPicklistQuestionBlock;
        if (picklist) {
          picklist.answerId = question.childQuestionBlocks[0].answerGuid;
          picklist.answer = question.childQuestionBlocks[0].value;
        }
      } else {
        questionBlock.answerId = question.childQuestionBlocks[0].answerGuid;
        questionBlock.answer = question.childQuestionBlocks[0].value;
      }
    }
    return questionBlock;
  }

  private initializeQuestionRules() {
    // TODO I cut and pasted a chunk  of code from SDK for this.
    // want to support all different possible child questions without having to rewrite custom code
    // Also don't want to make this functionality public.
    // Revisit in future. Maybe there is a way to factor out processing of incoming JSON and HTTP services
    // from the UI components.
    this.questionRules = [
      {
        type: 'BOOLEAN', func: (questionJson) => {
          const booleanBlock = new ActivityBooleanQuestionBlock();
          booleanBlock.trueContent = questionJson.trueContent;
          booleanBlock.falseContent = questionJson.falseContent;
          return booleanBlock;
        }
      },
      {
        type: 'TEXT', func: (questionJson) => {
          // let's capture some of the validation into the textblock object itself
          // make's it easier to apply validations in the widget
          const textBlock = new ActivityTextQuestionBlock();
          textBlock.placeholder = questionJson.placeholder;
          questionJson.validations.forEach(validation => {
            if (validation.minLength !== undefined) {
              textBlock.minLength = validation.minLength;
            }
            if (validation.maxLength !== undefined) {
              textBlock.maxLength = validation.maxLength;
            }
            if (validation.regexPattern !== undefined) {
              textBlock.regexPattern = validation.regexPattern;
            }
          });
          textBlock.inputType = questionJson.inputType;
          return textBlock;
        }
      },
      {
        type: 'PICKLIST', func: (questionJson) => {
          const picklistBlock = new ActivityPicklistQuestionBlock();
          picklistBlock.picklistOptions = questionJson.picklistOptions;
          picklistBlock.picklistLabel = questionJson.picklistLabel;
          picklistBlock.selectMode = questionJson.selectMode;
          picklistBlock.renderMode = questionJson.renderMode;
          return picklistBlock;
        }
      },
      {
        type: 'DATE', func: (questionJson) => {
          const dateBlock = new ActivityDateQuestionBlock();
          dateBlock.renderMode = questionJson.renderMode;
          dateBlock.fields = questionJson.fields;
          dateBlock.placeholder = questionJson.placeholder;
          dateBlock.displayCalendar = questionJson.displayCalendar;
          if (dateBlock.renderMode === DateRenderMode.Picklist) {
            // Use loose null check and normalize missing/nulled properties to undefined.
            dateBlock.useMonthNames = (questionJson.useMonthNames == null
              ? undefined : questionJson.useMonthNames);
            dateBlock.startYear = (questionJson.startYear == null
              ? undefined : questionJson.startYear);
            dateBlock.endYear = (questionJson.endYear == null
              ? undefined : questionJson.endYear);
            dateBlock.firstSelectedYear = (questionJson.firstSelectedYear == null
              ? undefined : questionJson.firstSelectedYear);
          }
          return dateBlock;
        }
      },
      {
        type: 'COMPOSITE', func: (questionJson) => {
          const newBlock = new ActivityCompositeQuestionBlock();
          newBlock.addButtonText = questionJson.addButtonText;
          newBlock.allowMultiple = questionJson.allowMultiple;
          newBlock.allowMultiple && (newBlock.additionalItemText = questionJson.additionalItemText);
          newBlock.children = (questionJson.children as ActivityQuestionBlock<any>[])
            .map(childInputBlock => this.buildQuestionBlock(childInputBlock))
            .filter(block => block != null);
          return newBlock;
        }
      },
      {
        type: 'AGREEMENT', func: (questionJson) => {
          return new ActivityAgreementQuestionBlock();
        }
      }
    ];
  }
}
