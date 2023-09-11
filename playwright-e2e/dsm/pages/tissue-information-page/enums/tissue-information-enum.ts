export enum TissueInformationEnum {
  ASSIGNEE = 'Assignee',
  SHORT_ID = 'Short ID',
  FULL_NAME = 'Full Name',
  DATE_OF_BIRTH = 'Date of Birth',
  DATE_OF_MAJORITY = 'Date of Majority',
  DATE_OF_DIAGNOSIS = 'Date Of Diagnosis',
  DATE_OF_PX = 'Date of PX',
  TYPE_OF_PX = 'Type of PX',
  LOCATION_OF_PX = 'Location of PX',
  HISTOLOGY = 'Histology',
  ACCESSION_NUMBER = 'Accession Number',
  FACILITY = 'Facility',
  PHONE = 'Phone',
  FAX = 'Fax',
  DESTRUCTION_POLICY = 'Destruction Policy (years)',
  ONC_HISTORY_DATE = 'Onc History Date',
  TUMOR_SIZE = 'Tumor Size',
  SLIDES_TO_REQUEST = 'Slides to Request',
  FACILITY_WHERE_SAMPLE_WAS_REVIEWED = 'Facility where the sample was reviewed',
  TOTAL_NUMBER_SLIDES_MENTIONED = 'Total number of slides mentioned',
  BLOCK_TO_REQUEST = 'Block to Request',
  EXTENSIVE_TREATMENT_EFFECT = 'Extensive Treatment Effect',
  VIABLE_TUMOR = '% Viable Tumor',
  NECROSIS = '% Necrosis',
  VOCAB_CHECK = 'VOCAB_CHECK',
  REQUEST = 'Request Status'
}

export enum DynamicFieldsEnum {
  FAX_SENT = 'Fax Sent',
  TISSUE_RECEIVED = 'Tissue Received',
  PROBLEM_WITH_TISSUE = 'Problem with Tissue?',
  NOTES = 'Notes',
  DESTRUCTION_POLICY = 'Destruction Policy (years)',
  GENDER = 'Gender'
}

export enum SMIdEnum {
  USS_SM_IDS = 'USS SM-IDS',
  SCROLLS_SM_IDS = 'scrolls SM-IDS',
  H_E_SM_IDS = 'H&E SM-IDS',
}

export enum TissueDynamicFieldsEnum {
  NOTES = 'Notes',
  MATERIALS_RECEIVED = 'Materials received',
  USS = 'USS (unstained',
  BLOCK = 'Block(s)',
  H_E = 'H&E(s)',
  SCROLL = 'Scroll(s)',
  TISSUE_TYPE = 'Tissue Type',
  PATHOLOGY_REPORT = 'Pathology Report',
  TUMOR_TYPE = 'Tumor Type',
  TISSUE_SITE = 'Tissue Site',
  TUMOR_COLLABORATOR_SAMPLE_ID = 'Tumor Collaborator Sample ID',
  SK_ID = 'SK ID',
  FIRST_SM_ID = 'First SM ID',
  SM_ID_FOR_H_E = 'SM ID for H&E',
  DATE_SENT_TO_GP = 'Date sent to GP',
  SEQUENCING_RESULTS = 'Sequencing Results',
  EXPECTED_RETURN_DATE = 'Expected Return Date',
  RETURN_DATE = 'Return Date',
  BLOCK_TO_SHL = 'Block to SHL',
  SCROLLS_BACK_FROM_SHL = 'Scrolls back from SHL',
  BLOCK_ID_TO_SHL = 'Block ID to SHL',
  TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL = 'Tumor Percentage as reported by SHL',
  SHL_WORK_NUMBER = 'SHL Work Number',
  TRACKING_NUMBER = 'Tracking Number'
}

export enum ProblemWithTissueEnum {
  INSUFFICIENT_MATERIAL_PER_PATH = 'Insufficient material per path',
  INSUFFICIENT_MATERIAL_PER_SHL =  'Insufficient material per SHL',
  NO_E_SIGNATURES = 'No e signatures',
  PATH_DEPARTMENT_POLICY = 'Path department policy',
  PATH_DEPARTMENT_UNABLE_TO_LOCATE = 'Path department unable to locate',
  TISSUE_DESTROYED = 'Tissue destroyed',
  OTHER = 'Other',
  NO_PROBLEM = 'No Problem'
}

export enum TissueTypesEnum {
  SLIDE = 'Slide',
  BLOCK = 'Block',
  SCROLLS = 'Scrolls'
}

export enum TumorTypesEnum {
  PRIMARY = 'Primary',
  MET = 'Met',
  RECURRENT = 'Recurrent',
  UNKNOWN = 'Unknown'
}

export enum SequencingResultsEnum {
  FAILURE_AT_SHL = 'Failure at SHL',
  ABANDONED_AT_GP = 'Abandoned at GP',
  FAILED_PURITY = 'Failed Purity',
  EXTERNAL_PATH_REVIEW_FAILED = 'External Path Review Failed',
  SUCCESS = 'Success',
  EMPTY = ''
}
