import { TestID } from 'dss/pages/patient-type';

export interface PatientData {
  whoIsSigningUp: string;
  researchContentForm: string;
  additionalConsentForm: string;
  surveyForm: string;
  testId: Partial<TestID>;
}

export type TypePatient = 'child' | 'adult';

export type Patient = {
  [index in TypePatient]: PatientData;
};

export const LmsPatientsData: Patient = {
  child: {
    whoIsSigningUp: 'My child has been diagnosed with cancer(s) and I am signing up for them or with them.',
    researchContentForm: 'Research Consent Form - Parent or Guardian',
    additionalConsentForm: 'Additional Consent Form: Learning About Your Child’s Tumor',
    surveyForm: 'Survey: Your Child\'s LMS',
    testId: {
      firstName: 'answer:CONSENT_ASSENT_CHILD_FIRSTNAME',
      lastName: 'answer:CONSENT_ASSENT_CHILD_LASTNAME',
      signature: 'answer:CONSENT_SIGNATURE',
      authorizationSignature: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT',
      dateOfBirthLocation: "Your Child's Date of Birth",
      relationshipChild: 'Relationship to Child ',
      assentFirstName: 'answer:CONSENT_ASSENT_FIRSTNAME',
      assentLastName: 'answer:CONSENT_ASSENT_LASTNAME',
      assentSignature: 'answer:CONSENT_ASSENT_PARENT_SIGNATURE',
      assentChildSignature: 'answer:CONSENT_ASSENT_CHILD_SIGNATURE',
      bloodSamples: 'boolean-answer-CONSENT_ASSENT_BLOOD',
      assentTissue: 'boolean-answer-CONSENT_ASSENT_TISSUE',
      agreeToShareWithMeResults: 'answer:SOMATIC_CONSENT_TUMOR_PEDIATRIC'
    }
  },
  adult: {
    whoIsSigningUp: "I have been diagnosed with cancer(s) and I'm signing myself up.",
    researchContentForm: 'Research Consent Form',
    additionalConsentForm: 'Additional Consent Form: Learning About Your Tumor',
    surveyForm: 'Survey: Your LMS',
    testId: {
      firstName: 'answer:CONSENT_FIRSTNAME',
      lastName: 'answer:CONSENT_LASTNAME',
      signature: 'answer:CONSENT_SIGNATURE',
      authorizationSignature: 'answer:CONSENT_SELF_SIGNATURE_SUBJECT',
      dateOfBirthLocation: 'Date of Birth',
      bloodSamples: 'boolean-answer-CONSENT_BLOOD',
      assentTissue: 'boolean-answer-CONSENT_TISSUE',
      agreeToShareWithMeResults: 'answer:SOMATIC_CONSENT_ADDENDUM_TUMOR'
    }
  }
};