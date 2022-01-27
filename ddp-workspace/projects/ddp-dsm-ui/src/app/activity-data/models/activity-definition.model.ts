import { QuestionDefinition } from './question-definition.model';

export class ActivityDefinition {

  constructor(
    public activityCode: string,
    public activityName: string,
    public activityVersion: string,
    public questions: Array<QuestionDefinition>,
    public displayOrder:number=1, public showActivityStatus = true
  ) {
    this.activityCode = activityCode;
    this.activityName = activityName;
    this.activityVersion = activityVersion;
    this.questions = questions;
    this.displayOrder = displayOrder;
    this.showActivityStatus  = showActivityStatus;
  }

  static parse(json): ActivityDefinition {
    return new ActivityDefinition(json.activityCode, json.activityName, json.activityVersion, json.questions
      , json.displayOrder, json.showActivityStatus);
  }

  getQuestionDefinition(stableId: string): QuestionDefinition {
    return this.questions.find(x => x.stableId === stableId);
  }
}
