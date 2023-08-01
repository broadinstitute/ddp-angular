import { TestID } from 'dss/pages/patient-type';

export interface PatientData {
  whoIsSigningUp: string;
  researchContentForm: string;
  additionalConsentForm: string;
  surveyForm: string;
  testId: Partial<TestID>;
}

export type TypePatient = 'patient' | 'other';

export type Patient = {
  [index in TypePatient]: PatientData;
};

export const MBCPatientsData: any = {
  patient: {
    whoIsSigningUp: 'I have been diagnosed with metastatic breast cancer (also known as advanced or stage IV breast cancer). ' +
      "I'm willing to answer additional questions about myself and my experience with metastatic breast cancer.",
  },
  other: {
    whoIsSigningUp: "I haven't been diagnosed with metastatic breast cancer, but I want to stay informed about the" +
      ' Metastatic Breast Cancer Project by joining the email list.',
  }
};
