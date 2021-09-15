export interface DiaryResponse {
  email: string;
  cohort: string;
  active: boolean;
  end_date: string;
  completed: boolean;
  entries: {
    morning: number;
    evening: number;
  };
}
