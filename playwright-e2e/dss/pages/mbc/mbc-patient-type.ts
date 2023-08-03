export type TypePatient = 'patient' | 'other';


export const MBCPatientsData: any = {
  patient: {
    whoIsSigningUp: 'I have been diagnosed with metastatic breast cancer (also known as advanced or stage IV breast ' +
      "cancer). I'm willing to answer additional questions about myself and my experience with metastatic breast cancer.",
    surveyForm: 'Join the movement: tell us about yourself',
  },
  other: {
    whoIsSigningUp: "I haven't been diagnosed with metastatic breast cancer, but I want to stay informed about " +
      'the Metastatic Breast Cancer Project by joining the email list.',
    surveyForm: 'Survey: Your LMS',
  }
};
