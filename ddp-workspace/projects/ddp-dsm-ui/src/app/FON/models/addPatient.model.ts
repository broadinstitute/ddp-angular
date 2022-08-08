export interface AddPatientModel {
  email: string;
  studyGuid: string;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  consentDate: Date | string;
  centerId?: string;
  assentDate?: Date |string;
}
