import {QuestionAnswerModel} from "./questionAnswer.model";

export interface ActivityDataModel {
  activityCode: string;
  activityVersion: string;
  attributes: object;
  completedAt: number;
  createdAt: number;
  guid: string;
  lastUpdatedAt: number;
  questionsAnswers: Partial<QuestionAnswerModel>[];
}
