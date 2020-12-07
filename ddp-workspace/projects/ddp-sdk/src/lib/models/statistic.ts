export interface Statistic {
  configuration: {
    type: string;
    questionStableId: string | null;
    answerValue: string | null;
  };
  statistics: {
    name: string;
    data: {
      count: string;
      optionDetails?: any;
    };
  }[];
}
