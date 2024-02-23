export type NAVS = keyof typeof NAV;

export const NAV = {
  DROPDOWN: {
    SELECTED_STUDY: 'Selected study',
    SAMPLES: 'Samples',
    STUDY: 'Study',
    MISCELLANEOUS: 'Miscellaneous',
  },
  SELECTED_STUDY: {
    AT: 'AT',
    BRUGADA: 'Brugada',
    BASIL: 'basil',
    ANGIO: 'Angio',
    BRAIN: 'Brain',
    DARWIN: `Darwin's Ark`,
    OSTEO: 'Osteo',
    MBC: 'MBC',
    PROSTATE: 'Prostate',
    ESC: 'ESC',
    PANCAN: 'PanCan',
    PRION: 'Prion',
    VOICES: 'Voices',
    LMS: 'Leiomyosarcoma',
    OSTEO2: 'OS PE-CGS',
    RGP: 'RGP',
    RAREX: 'RareX',
    TEST_BOSTON: 'Test Boston',
  },
  SAMPLES: {
    UNSENT_KITS_OVERVIEW: 'Unsent Kits Overview',
    REPORT: 'Report',
    SUMMARY: 'Summary',
    KITS_WITHOUT_LABELS: 'Kits without Labels',
    QUEUE: 'Queue',
    ERROR: 'Error',
    INITIAL_SCAN: 'Initial Scan',
    TRACKING_SCAN: 'Tracking Scan',
    FINAL_SCAN: 'Final Scan',
    RGP_FINAL_SCAN: 'RGP Final Scan',
    RECEIVING_SCAN: 'Receiving Scan',
    SENT: 'Sent',
    RECEIVED: 'Received',
    SENT_RECEIVED_OVERVIEW: 'Sent/Received Overview',
    DEACTIVATED: 'Deactivated',
    SEARCH: 'Search',
    KIT_UPLOAD: 'Kit Upload',
    STOOL_SAMPLE_UPLOAD: 'Stool Sample Upload',
    LABEL_SETTINGS: 'Label Settings',
    CLINICAL_ORDERS: 'Clinical Orders',
  },
  STUDY: {
    DASHBOARD: 'Dashboard',
    STATISTICS_DASHBOARD: 'Statistics Dashboard',
    PARTICIPANT_LIST: 'Participant List',
    TISSUE_LIST: 'Tissue List',
    FIELD_SETTINGS: 'Field Settings',
    MR_ABSTRACTION_SETTINGS: 'MR Abstraction Settings',
  },
  MISCELLANEOUS: {
    DOWNLOAD_PDF: 'Download PDF',
    DRUG_LIST: 'Drug List',
    FOLLOW_UP_SURVEY: 'Follow-Up Survey',
    MAILING_LIST: 'Mailing List',
    NDI_DOWNLOAD: 'NDI Download',
    ONC_HISTORY_UPLOAD: 'Onc History Upload',
    PARTICIPANT_WITHDRAWAL: 'Participant Withdrawal',
    PARTICIPANT_EVENT: 'Participant Event',
    USERS_AND_PERMISSIONS: 'Users And Permissions',
  }
}

export enum Filter {
  NOT_EMPTY = 'Not Empty',
  EXACT_MATCH = 'Exact Match',
  RANGE = 'Range',
  EMPTY = 'Empty'
}

// Table column headers
export enum Column {
  SHORT_ID = 'Short ID',
  CONTACT_INFORMATION = 'Contact Information Columns',
  COHORT_TAGS = 'Cohort Tags Columns',
  DSM_COLUMNS = 'Participant - DSM Columns',
  MEDICAL_RECORD = 'Medical Record Columns',
  MEDICAL_RELEASE_FORM = 'Medical Release Form Columns',
  ONC_HISTORY = 'Onc History Columns',
  PARTICIPANT = 'Participant Columns',
  RESEARCH_CONSENT_FORM = 'Research Consent Form Columns',
  SAMPLE = 'Sample Columns',
  DIAGNOSIS_TYPE = 'Survey: Your Child\'s/Your [DIAGNOSIS TYPE] Columns',
  TISSUE = 'Tissue Columns',
  TYPE = 'Type',
  INSTITUTION = 'Institution',
  MR_STATUS = 'MR Status',
  MR_PROBLEM = 'MR Problem',
  MR_REQUIRES_REVIEW = 'MR Requires Review',
  PAPER_CR_REQUIRED = 'Paper C/R Required',
  MR_FOLLOWUP_REQUIRED = 'MR Follow-Up Required',
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

// Text labels for static text, input, button, textarea, etc.
export enum Label {
  DDP = 'DDP',
  STATUS = 'Status',
  REGISTRATION_DATE = 'Registration Date',
  SHORT_ID = 'Short ID',
  GUID = 'Internal Participant ID',
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  FULL_NAME = 'Full Name',
  EMAIL = 'E-Mail',
  DO_NOT_CONTACT = 'Do Not Contact',
  DATE_OF_BIRTH = 'Date of Birth',
  DATE_OF_MAJORITY = 'Date of Majority',
  DATE_OF_DIAGNOSIS = 'Date of Diagnosis',
  GENDER = 'Gender',
  PREFERRED_LANGUAGE = 'Preferred Language',
  PARTICIPANT_ID = 'Participant ID',
  CONSENT_BLOOD = 'Consent Blood',
  CONSENT_TISSUE = 'Consent Tissue',
  ASSIGNEE = 'Assignee',
  CURRENT_STATUS = 'Current Status',
  INSTITUTION_INFO = 'Institution Info',
  INITIAL_MR_REQUEST = 'Initial MR Request',
  INITIAL_MR_RECEIVED = 'Initial MR Received',
  CONFIRMED_INSTITUTION_NAME = 'Confirmed Institution Name',
  NO_ACTION_NEEDED = 'No Action Needed',
  KIT_UPLOAD_TYPE = 'Kit Upload Type',
  NORMAL_COLLABORATOR_SAMPLE_ID = 'Normal Collaborator Sample Id',
  MF_BARCODE = 'MF Barcode',
  SENT = 'Sent',
  RECEIVED = 'Received',
  DEACTIVATED = 'Deactivated',
  RESULTS = 'Results',
  COLLECTION_DATE = 'Collection Date',
  SEQUENCING_RESTRICTIONS = 'Sequencing Restriction',
  SAMPLE_NOTES = 'Sample Notes',
}

export enum DownloadFileFormat {
  XLSX = 'Excel (.xlsx)',
  TSV = 'Tab-delimited (.tsv)'
}

export enum DownloadTextFormat {
  HUMAN_READABLE = 'Human-readable',
  ANALYSIS_FRIENDLY = 'Analysis-friendly'
}
