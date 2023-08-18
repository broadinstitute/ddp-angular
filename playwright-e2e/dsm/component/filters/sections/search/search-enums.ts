export enum AdditionalFilter {
  NOT_EMPTY = 'Not Empty',
  EXACT_MATCH = 'Exact Match',
  RANGE = 'Range',
  EMPTY = 'Empty'
}

export enum CustomViewColumns {
  CONTACT_INFORMATION = 'Contact Information Columns',
  MEDICAL_RECORD = 'Medical Record Columns',
  PARTICIPANT = 'Participant Columns',
  RESEARCH_CONSENT_FORM = 'Research Consent Form Columns',
  SAMPLE = 'Sample Columns',
}

/* Participant Column group related enums */

export enum ParticipantColumns {
  CONSENT_BLOOD = 'Consent Blood',
  CONSENT_TISSUE = 'Consent Tissue',
  COUNTRY = 'Country',
  DATE_OF_BIRTH = 'Date of Birth',
  DATE_OF_MAJORITY = 'Date of Majority',
  DDP = 'DDP',
  DIAGNOSIS_MONTH = 'Diagnosis Month',
  DIAGNOSIS_YEAR = 'Diagnosis Year',
  DO_NOT_CONTACT = 'Do Not Contact',
  EMAIL = 'Email',
  FILE_UPLOAD_TIME = 'File Upload Time',
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  PARTICIPANT_ID = 'Participant ID',
  PREFERRED_LANGUAGE = 'Preferred Language',
  REGISTRATION_DATE = 'Registration Date',
  SHORT_ID = 'Short ID',
  STATUS = 'Status',
  UPLOADED_FILE_NAME = 'Uploaded File Name',
}

export enum EnrollmentStatus {
  REGISTERED = 'Registered',
  EXITED_BEFORE_ENROLLMENT = 'Exited before Enrollment',
  EXITED_AFTER_ENROLLMENT = 'Exited after Enrollment',
  ENROLLED = 'Enrolled',
  LOST_TO_FOLLOWUP = 'Lost to Followup',
  COMPLETED = 'Completed',
}

/* Sample Column group related enums */

export enum SampleColumns {
  COLLABORATOR_PARTICIPANT_ID = 'Collaborator Participant ID',
  COLLECTION_DATE = 'Collection Date',
  MF_CODE = 'MF code',
  NORMAL_COLLABORATOR_SAMPLE_ID = 'Normal Collaborator Sample ID',
  SAMPLE_DEACTIVATION = 'Sample Deactivation',
  SAMPLE_NOTES = 'Sample Notes',
  SAMPLE_RECEIVED = 'Sample Received',
  SAMPLE_SENT = 'Sample Sent',
  SAMPLE_TYPE = 'Sample Type',
  SEQUENCING_RESTRICTION = 'Sequecung Restriction',
  STATUS = 'Status',
  TRACKING_IN = 'Tracking-in',
  TRACKING_OUT = 'Tracking-out',
}

export enum KitStatus {
  WAITING_ON_GP = 'Waiting on GP',
  GP_MANUAL_LABEL = 'GP manual Label',
  DEACTIVATED = 'Deactivated',
  SHIPPED = 'Shipped',
  RECEIVED = 'Received',
}
