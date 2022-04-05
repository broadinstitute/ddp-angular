export interface RenderActivity {
  i18nKey: string | null;
  isCurrent?: boolean;
  isComplete?: boolean;
}

export enum RenderActivityKey {
  Consent = 'CONSENT',
  About = 'ABOUT',
  MedicalReleaseForm = 'MEDICAL_RELEASE_FORM',
  MedicalRecordUpload = 'MEDICAL_RECORD_UPLOAD',
  PatientSurvey = 'PATIENT_SURVEY',
}
