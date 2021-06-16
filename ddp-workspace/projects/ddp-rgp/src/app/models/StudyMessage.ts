export interface StudyMessage {
  group: number;
  exclusive: boolean;
  date: Date;
  timestamp: Date;
  subject: string;
  message: string;
  more?: string;
}
