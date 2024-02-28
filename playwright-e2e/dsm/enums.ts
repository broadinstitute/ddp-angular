export enum DataFilter {
  NOT_EMPTY = 'Not Empty',
  EXACT_MATCH = 'Exact Match',
  RANGE = 'Range',
  EMPTY = 'Empty',
  ENROLLED = 'Enrolled',
  REQUEST = 'Request',
  RECEIVED = 'Received',
  NO = 'No',
  YES = 'Yes',
  REGISTERED = 'Registered',
}

// Table column headers

export enum CustomizeView {
  CONTACT_INFORMATION = 'Contact Information Columns',
  COHORT_TAGS = 'Cohort Tags Columns',
  DSM_COLUMNS = 'Participant - DSM Columns',
  GENOME_STUDY = 'Genome Study Columns',
  MEDICAL_RECORD = 'Medical Record Columns',
  MEDICAL_RELEASE_FORM = 'Medical Release Form Columns',
  ONC_HISTORY = 'Onc History Columns',
  PARTICIPANT = 'Participant Columns',
  PARTICIPANT_INFO = 'Participant Info Columns',
  RESEARCH_CONSENT_FORM = 'Research Consent Form Columns',
  SAMPLE = 'Sample Columns',
  DIAGNOSIS_TYPE = 'Survey: Your Child\'s/Your [DIAGNOSIS TYPE] Columns',
  TISSUE = 'Tissue Columns',
  CLINICAL_ORDERS = 'Clinical Orders Columns',
  ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE = 'Additional Consent: Learning More About Your DNA with Invitae Columns',
  ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR = 'Additional Consent: Learning About Your Tumor Columns',
}

export enum Kit {
  SALIVA = 'SALIVA',
  BLOOD = 'BLOOD',
  STOOL = 'STOOL',
  BLOOD_AND_RNA = 'BLOOD & RNA'
}

export enum Tab {
  CONTACT_INFORMATION = 'Contact Information',
  GENOME_STUDY = 'Genome Study',
  INVITAE = 'Invitae',
  MEDICAL_RECORD = 'Medical Records',
  ONC_HISTORY = 'Onc History',
  SAMPLE_INFORMATION = 'Sample Information',
  SEQUENCING_ORDER = 'Sequencing Order',
  SURVEY_DATA = 'Survey Data',
}

// Address
export enum Contact {
  STREET_1 = 'Street 1',
  CITY = 'City',
  STATE = 'State',
  COUNTRY = 'Country',
  ZIP = 'Zip',
  VALID = 'Valid',
  PHONE = 'Phone number'
}

export enum UserPermission {
  DEATH_INDEX_DOWNLOAD = 'Death index download',
  DOWNLOAD_PDFS = 'Download PDFs',
  FIELD_SETTINGS_ADD_REMOVE_MODIFY = 'Field Settings: Add, remove, modify',
  FOLLOW_UP_SURVEYS = 'Follow-up surveys',
  KIT_DISCARD_SAMPLES = 'Kit: Discard samples',
  KIT_VIEW_AND_DEACTIVATION_REACTIVATION = 'Kit: View, de/reactivation',
  KIT_CREATE_OVERNIGHT_SHIPPING_LABELS = 'Kit: Create overnight shipping labels',
  KIT_RECEIVE_AND_SCAN = 'Kit: receive and scan',
  KIT_CLINICAL_ORDER = 'Kit: Clinical order',
  KIT_SHIPPING = 'Kit: Shipping',
  KIT_VIEW_KIT_PAGES = 'Kit: View kit pages',
  KIT_UPLOAD = 'Kit: Upload',
  KIT_UPLOAD_INVALID_ADDRESS = 'Kit: Upload invalid address',
  MAILING_LIST_VIEW_AND_DOWNLOAD = 'Mailing List: View, download',
  MANAGE_STUDY_PERMISSIONS = 'Manage study permissions',
  MEDICAL_RECORDS_ADD_TO_ABSTRACTOR_ASSIGNEE_LIST = 'Medical Records: Add to abstractor assignee list',
  MEDICAL_RECORDS_ABSTRACTION = 'Medical Records: Abstraction',
  MEDICAL_RECORDS_CANNOT_REQUEST_TISSUE = 'Medical Records: Cannot request tissue)',
  MEDICAL_RECORDS_QUALITY_ASSURANCE = 'Medical Records: Quality assurance',
  MEDICAL_RECORDS_ADD_TO_REQUESTER_ASSIGNEE_LIST = 'Medical Records: Add to requester assignee list',
  MEDICAL_RECORDS_VIEW_AND_REQUEST_RECORDS_AND_TISSUE = 'Medical Records: View, request records and tissue',
  PARTICIPANT_EDIT = 'Participant: Edit',
  PARTICIPANT_FILES_VIEW_DOWNLOAD = 'Participant Files: View, download',
  PARTICIPANT_STOP_AUTOMATED_EMAILS = 'Participant: Stop automated emails',
  PARTICIPANT_WITHDRAWAL = 'Participant: Withdrawal',
  PARTICIPANT_VIEW_LIST = 'Participant: View list',
  ONC_HISTORY_UPLOAD = 'Onc history: Upload',
  SEQUENCING_ORDER_VIEW_STATUS = 'Sequencing order: View status',
  SHARED_LEARNINGS_UPLOAD_FILE = 'Shared learnings: Upload file',
  SHARED_LEARNINGS_VIEW = 'Shared learnings: View',
  VIEW_SURVEY_DATA_ONLY = 'View survey data only',
}

// Text labels for static text, input, button, textarea, table column header etc.
export enum Label {
  ASSIGNEE = 'Assignee',
  COUNTRY = 'Country',
  CLINICAL_ORDER_ID = 'Clinical Order Id',
  COHORT_TAG_NAME = 'Cohort Tag Name',
  COLLABORATOR_PARTICIPANT_ID = 'Collaborator Participant ID',
  COLLABORATOR_SAMPLE_ID = 'Collaborator Sample ID',
  COLLECTION_DATE = 'Collection Date',
  CONFIRMED_INSTITUTION_NAME = 'Confirmed Institution Name',
  CONSENT_BLOOD = 'Consent Blood',
  CONSENT_TISSUE = 'Consent Tissue',
  CURRENT_STATUS = 'Current Status',
  DATE_OF_BIRTH = 'Date of Birth',
  DATE_OF_MAJORITY = 'Date of Majority',
  DATE_OF_DIAGNOSIS = 'Date of Diagnosis',
  DEACTIVATED = 'Deactivated',
  DEACTIVATION_REASON = 'Deactivation Reason',
  DIAGNOSIS_TYPE = 'DIAGNOSIS_TYPE',
  DO_NOT_CONTACT = 'Do Not Contact',
  DDP = 'DDP',
  DDP_REALM = 'DDP-Realm',
  EMAIL = 'Email',
  EMAIL_2 = 'E-Mail',
  ERROR_REASON = 'Error Reason',
  DATE_SIGNED_UP = 'Date signed up',
  FIRST_NAME = 'First Name',
  FOLLOW_UP_REQUIRED = 'Follow-Up required',
  FULL_NAME = 'Full Name',
  GENDER = 'Gender',
  GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED = 'GERMLINE_CONSENT_ADDENDUM Survey Created',
  GUID = 'Internal Participant ID',
  INSTITUTION = 'Institution',
  INSTITUTION_INFO = 'Institution Info',
  INSTITUTION_NAME = 'Institution Name',
  INITIAL_MR_REQUEST = 'Initial MR Request',
  INITIAL_MR_RECEIVED = 'Initial MR Received',
  KIT_UPLOAD_TYPE = 'Kit Upload Type',
  LAST_NAME = 'Last Name',
  LEGACY_SHORT_ID = 'Legacy Short ID',
  MAILING_ADDRESS = 'Your Mailing Address *',
  MF_BARCODE = 'MF Barcode',
  MF_CODE = 'MF code',
  MR_PROBLEM = 'MR Problem',
  MR_FOLLOWUP_REQUIRED = 'MR Follow-Up Required',
  MR_REVIEW = 'MR Review',
  MR_REQUIRES_REVIEW = 'MR Requires Review',
  MR_STATUS = 'MR Status',
  NO_ACTION_NEEDED = 'No Action Needed',
  NORMAL_COLLABORATOR_SAMPLE_ID = 'Normal Collaborator Sample ID',
  ONC_HISTORY_CREATED = 'Onc History Created',
  PAPER_CR_REQUIRED = 'Paper C/R Required',
  PARTICIPANT_ID = 'Participant ID',
  PHYSICIAN = 'PHYSICIAN',
  PREFERRED_LANGUAGE = 'Preferred Language',
  PRINT_KIT = 'Print Kit',
  RECEIVED = 'Received',
  REGISTRATION_DATE = 'Registration Date',
  RELEASE_SELF = 'RELEASE_SELF',
  REQUEST_STATUS = 'Request Status',
  RESULTS = 'Results',
  SAMPLE_KIT_BARCODE = 'Sample kit barcode for genome study',
  SAMPLE_SENT = 'Sample Sent',
  SAMPLE_NOTES = 'Sample Notes',
  SAMPLE_RECEIVED = 'Sample Received',
  SAMPLE_TYPE = 'Sample Type',
  SENT = 'Sent',
  SEQUENCING_RESTRICTIONS = 'Sequencing Restriction',
  SHIPPING_ID = 'Shipping ID',
  SHORT_ID = 'Short ID',
  SOMATIC_CONSENT_TUMOR = 'SOMATIC_CONSENT_TUMOR',
  STATUS = 'Status',
  STATE = 'State',
  SUBJECT_ID = 'Subject ID',
  TISSUE_REQUEST_DATE = 'Tissue Request Date',
  TRACKING_NUMBER = 'Tracking Number',
  TRACKING_RETURN = 'Tracking Return',
  TYPE = 'Type',
  TUMOR_COLLABORATOR_SAMPLE_ID = 'Tumor Collaborator Sample ID',
  VALID = 'Valid',
}

export enum FileFormat {
  XLSX = 'Excel (.xlsx)',
  TSV = 'Tab-delimited (.tsv)'
}

export enum TextFormat {
  HUMAN_READABLE = 'Human-readable',
  ANALYSIS_FRIENDLY = 'Analysis-friendly'
}

export enum SampleStatus {
  SHIPPED = 'shipped',
  DEACTIVATED = 'deactivated',
  WAITING_ON_GP = 'queue',
  GP_MANUAL_LABEL = 'error',
  RECEIVED = 'received'
}

export enum FamilyMember {
  PROBAND = 'Self',
  SISTER = 'Sister',
  BROTHER = 'Brother',
  MOTHER = 'Mother',
  FATHER = 'Father',
  PATERNAL_GRANDMOTHER = 'Paternal Grandmother',
  PATERNAL_GRANDFATHER = 'Paternal Grandfather',
  MATERNAL_GRANDMOTHER = 'Maternal Grandmother',
  MATERNAL_GRANDFATHER = 'Maternal Grandfather',
  DAUGHTER = 'Daughter',
  SON = 'Son',
  OTHER = 'Other',
  HALF_SIBLING_MATERNAL = 'Half Sibling Maternal',
  HALF_SIBLING_PATERNAL = 'Half Sibling Paternal',
  MATERNAL_AUNT = 'Maternal Aunt',
  MATERNAL_FIRST_COUSIN = 'Maternal First Cousin',
  MATERNAL_UNCLE = 'Maternal Uncle',
  PATERNAL_AUNT = 'Paternal Aunt',
  PATERNAL_FIRST_COUSIN = 'Paternal First Cousin',
  PATERNAL_UNCLE = 'Paternal Uncle',
}

export enum ResponsePayload {
  RESULT_TYPE_SUCCESS = 'SUCCESS',
  TASK_TYPE_UPDATE_PROFILE = 'UPDATE_PROFILE',
}
