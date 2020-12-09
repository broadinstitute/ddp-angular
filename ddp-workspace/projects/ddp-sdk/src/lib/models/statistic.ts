import { ActivityPicklistOption } from './activity/activityPicklistOption';

export interface Statistic<T> {
  configuration: {
    type: T;
    questionStableId: string | null;
    answerValue: string | null;
  };
  statistics: {
    name: string;
    data: {
      count: string;
      optionDetails?: ActivityPicklistOption;
    };
  }[];
}
