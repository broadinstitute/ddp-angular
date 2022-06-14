import {QuestionDefinitionModel} from "./questionDefinition.model";

export interface ActivityDefinitionModel {
  activityCode: string;
  activityName: string;
  activityVersion: string;
  questions: QuestionDefinitionModel[];
  displayOrder: number;
  showActivityStatus: boolean;
  studyGuid: string;
}
