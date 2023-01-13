interface CancerDiagnosed {
  prompt: string;
  cancer: string;
}
interface PatientData {
  whoIsSigningUp: string;
  cancerDiagnosed: CancerDiagnosed;
}

export type typePatient = 'child' | 'adult';

export type Patient = {
  [index in typePatient]: PatientData;
};

export const PatientsData: Patient = {
  child: {
    whoIsSigningUp: 'My child has been diagnosed with cancer(s) and I am signing up for them or with them.',
    cancerDiagnosed: {
      prompt: 'What primary cancer(s) has your child been diagnosed with? ',
      cancer: 'Cervical cancer'
    }
  },
  adult: {
    whoIsSigningUp: "I have been diagnosed with cancer(s) and I'm signing myself up.",
    cancerDiagnosed: {
      prompt: 'What primary cancer(s) have you been diagnosed with?',
      cancer: 'Cervical cancer'
    }
  }
};
