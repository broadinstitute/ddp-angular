export interface UserInfoResponse {
  email: string;
  start: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  end: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  cohort: string;
  unique_id: string;
  diary_url: string;
}
