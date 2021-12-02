import { ActivityConfig } from './activityConfig';
import { PlusCodePrecision } from './plusCodePrecision';

export interface StudyConfig {
  name: string;
  baseWebUrl: string;
  guid: string;
  irbPassword: string | null;
  plusCodePrecision: PlusCodePrecision | null;
  recaptchaSiteKey: string | null;
  shareParticipantLocation: false;
  studyEmail: string;
  activities: ActivityConfig[];

}
