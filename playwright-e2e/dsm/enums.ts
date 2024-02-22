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

export enum Column {
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
}

export enum Kit {
  SALIVA = 'SALIVA',
  BLOOD = 'BLOOD',
  STOOL = 'STOOL',
  BLOOD_AND_RNA = 'BLOOD & RNA'
}
