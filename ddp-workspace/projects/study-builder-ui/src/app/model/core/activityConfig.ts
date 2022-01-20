import { PexExpression } from './pexExpression';
import { ActivityType } from './activityType';
import { FormType } from './formType';
import { TimestampString } from './timestampString';
import { ListStyleHint } from './listStyleHint';
import { Translation } from './translation';
import { Validation } from './validation';
import { Section } from './section';
import { Template } from './template';

export interface ActivityConfig {
  activityCode: string;
  activityType: ActivityType;
  allowOndemandTrigger: false;
  allowUnauthenticated: false;
  closing: any; //TBD
  consentedExpr: PexExpression | null;
  creationExpr: PexExpression | null;
  displayOrder: number;
  editTimeoutSec: null;
  elections: [{ selectedExpr: PexExpression; stableId: string }];
  excludeFromDisplay: boolean;
  formType: FormType;
  introduction: any; //tbd
  lastUpdated: TimestampString | null;
  lastUpdatedTextTemplate: Template | null;
  listStyleHint: ListStyleHint;
  mappings: any[]; //TBD
  maxInstancePerUser: number; // positive integer
  readOnlyHint: Template | null;
  sections: Section[];
  // Should a snapshot of activity substitution values be saved on the first submit?
  // defaults to false. This is typically used with write-once activities.
  snapshotSubstitutionsOnSubmit: false;
  studyGuid: string;
  translatedDescriptions: Translation[];
  translatedNames: Translation[];
  translatedSubtitles: Translation[];
  translatedSummaries: Translation[];
  translatedTitles: Translation[];
  validations: Validation[];
  versionTag: string;
  writeOnce: boolean;
}
