import { PexExpression } from './pexExpression';
import { Translation } from './translation';
import { Mapping } from './mapping';
import { Template } from './template';
import { ActivityValidation } from './activityValidation';

export interface AbstractActivityDef {
  activityType: 'FORMS';
  studyGuid: string;
  activityCode: string;
  versionTag: string;
  maxInstancesPerUser: number | null;
  displayOrder: number;
  writeOnce: boolean;
  editTimeoutSec?: number | null;
  allowOndemandTrigger: boolean;
  excludeFromDisplay: boolean;
  allowUnauthenticated: boolean;
  translatedNames: Array<Translation>;
  translatedSecondNames: Array<Translation>;
  translatedTitles: Array<Translation>;
  translatedSubtitles: Array<Translation>;
  translatedDescriptions: Array<Translation>;
  translatedSummaries: Array<Translation>;
  readonlyHintTemplate?: Template | null;
  isFollowup?: boolean;
  // not used AFAICT
  creationExpr?: PexExpression | null;
  // not in GSON mapping! Comes from StudyBuilder conf file
  mappings: Array<Mapping>;
  // not in GSON mapping! Comes from StudyBuilder conf file
  validations: Array<ActivityValidation>
}
