import { StudyMessage } from './StudyMessage';

export interface StudyPerson {
  subjectId: string;
  firstName: string;
  lastName: string;
  messages: Array<StudyMessage>;
}
