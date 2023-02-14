interface CancerDiagnosed {
  prompt: string;
  typeCancer: string;
}

export interface PatientData {
  whoIsSigningUp: string;
  cancerDiagnosed: CancerDiagnosed;
  researchContentForm: string;
  ddpTestID: {
    age: string;
    firstName: string;
    lastName: string;
    signature: string;
    authorizationSignature: string;
    dateOfBirthLocation: string;
    relationshipChild?: string;
    assentFirstName?: string;
    assentLastName?: string;
    assentSignature?: string;
    assentChildSignature?: string;
    bloodSamples?: string;
    assentTissue?: string;
  };
}

export type TypePatient = 'child' | 'adult' | 'secondChild';

export type Patient = {
  [index in TypePatient]: PatientData;
};

export const PatientsData: Patient = {
  child: {
    whoIsSigningUp: 'My child has been diagnosed with cancer(s) and I am signing up for them or with them.',
    cancerDiagnosed: {
      prompt: 'What primary cancer(s) has your child been diagnosed with? ',
      typeCancer: 'Leukemia'
    },
    researchContentForm: 'Research Consent Form - Parent or Guardian',
    ddpTestID: {
      age: 'answer:AGE',
      firstName: 'answer:ASSENT_CHILD_FIRSTNAME',
      lastName: 'answer:ASSENT_CHILD_LASTNAME',
      signature: 'answer:CONSENT_SIGNATURE',
      authorizationSignature: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT',
      dateOfBirthLocation: "Your Child's Date of Birth",
      relationshipChild: 'Relationship to Child ',
      assentFirstName: 'answer:ASSENT_FIRSTNAME',
      assentLastName: 'answer:ASSENT_LASTNAME',
      assentSignature: 'answer:ASSENT_SIGNATURE',
      assentChildSignature: 'answer:ASSENT_CHILD_SIGNATURE',
      bloodSamples: 'boolean-answer-ASSENT_BLOOD',
      assentTissue: 'boolean-answer-ASSENT_TISSUE'
    }
  },
  secondChild: {
    whoIsSigningUp: 'My child has been diagnosed with cancer(s) and I am signing up for them or with them.',
    cancerDiagnosed: {
      prompt: 'What primary cancer(s) has your child been diagnosed with? ',
      typeCancer: 'Pancreatic cancer'
    },
    researchContentForm: 'Research Consent Form - Parent or Guardian',
    ddpTestID: {
      age: 'answer:CHILD_AGE',
      firstName: 'answer:PARENTAL_CHILD_FIRSTNAME',
      lastName: 'answer:PARENTAL_CHILD_LASTNAME',
      signature: 'answer:CONSENT_SIGNATURE',
      authorizationSignature: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT',
      dateOfBirthLocation: "Your Child's Date of Birth",
      relationshipChild: 'Relationship to Child ',
      assentFirstName: 'answer:PARENTAL_FIRSTNAME',
      assentLastName: 'answer:PARENTAL_LASTNAME',
      assentSignature: 'answer:PARENTAL_SIGNATURE',
      assentChildSignature: 'answer:ASSENT_CHILD_SIGNATURE',
      bloodSamples: 'boolean-answer-PARENTAL_BLOOD',
      assentTissue: 'boolean-answer-PARENTAL_TISSUE'
    }
  },
  adult: {
    whoIsSigningUp: "I have been diagnosed with cancer(s) and I'm signing myself up.",
    cancerDiagnosed: {
      prompt: 'What primary cancer(s) have you been diagnosed with?',
      typeCancer: 'Cervical cancer'
    },
    researchContentForm: 'Research Consent Form',
    ddpTestID: {
      age: 'answer:AGE',
      firstName: 'answer:CONSENT_FIRSTNAME',
      lastName: 'answer:CONSENT_LASTNAME',
      signature: 'answer:CONSENT_SIGNATURE',
      authorizationSignature: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT',
      dateOfBirthLocation: 'Date of Birth',
      bloodSamples: 'boolean-answer-CONSENT_BLOOD',
      assentTissue: 'boolean-answer-CONSENT_TISSUE'
    }
  }
};
