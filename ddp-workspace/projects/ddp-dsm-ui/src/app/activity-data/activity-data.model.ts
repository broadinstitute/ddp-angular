import { QuestionAnswer } from './models/question-answer.model';

export class ActivityData {
  constructor(public completedAt: number, public createdAt: number, public lastUpdatedAt: number, public activityCode: string,
               public activityVersion: string, public status: string, public questionsAnswers: Array<QuestionAnswer>) {
    this.completedAt = completedAt;
    this.createdAt = createdAt;
    this.lastUpdatedAt = lastUpdatedAt;
    this.activityCode = activityCode;
    this.activityVersion = activityVersion;
    this.status = status;
    this.questionsAnswers = questionsAnswers;
  }

  static parse(json): ActivityData {
    const questionAnswers: Array<QuestionAnswer> = [];
    if (json != null) {
      Object.keys(json.questionsAnswers).forEach((key: string) => {
        const value: QuestionAnswer = json.questionsAnswers[ key ];
        questionAnswers.push(value);
      });
      return new ActivityData(json.completedAt, json.createdAt, json.lastUpdatedAt, json.activityCode,
        json.activityVersion, json.status, questionAnswers);
    }
    return null;
  }

  searchForAnswerByStableId(stableId: string): QuestionAnswer {
    return this.questionsAnswers.find(x => x.stableId === stableId);
  }
}
