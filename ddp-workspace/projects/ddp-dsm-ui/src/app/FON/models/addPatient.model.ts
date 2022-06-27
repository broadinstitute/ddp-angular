export interface AddPatientModel {
  email: string;
  studyGuid:string;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  informedConsentDate: Date | string;
  centerId?: string;
  assentDate?: Date |string;
}
