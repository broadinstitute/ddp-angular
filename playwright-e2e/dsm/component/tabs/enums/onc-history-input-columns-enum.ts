export enum OncHistoryInputColumnsEnum {
  NOTES = 'Notes',
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
  REQUEST = 'Request'
}

export enum OncHistorySelectRequestEnum {
  NEEDS_REVIEW = 'Needs Review',
  DONT_REQUEST = "Don't Request",
  ON_HOLD = 'On Hold',
  REQUEST = 'Request',
  SENT = 'Sent',
  RECEIVED = 'Received',
  RETURNED = 'Returned',
  UNABLE_TO_OBTAIN = 'Unable To Obtain'
}

export enum InputTypeEnum {
  TEXTAREA = 'textarea-field',
  INPUT = 'input-field',
  DATE = 'date-field',
  SELECT = 'select-field'
}
