export enum KitType {
  SALIVA = 'SALIVA',
  BLOOD = 'BLOOD',
  STOOL = 'STOOL',
  BLOOD_AND_RNA = 'BLOOD & RNA'
}

export enum KitSampleType {
  RESEARCH = 'Research Sample',
  CLINICAL = 'Clinical Sample'
}

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
  ABSTRACTION = 'Abstraction Columns',
  ADD_CHILD_PARTICIPANT = 'Add child participant Columns',
  ADDITIONAL_CONSENT_ASSENT_LEARNING_ABOUT_CHILD_TUMOR = `Additional Consent & Assent: Learning About Your Child’s Tumor Columns`,
  ADDITIONAL_ASSENT_LEARNING_CHILD_DNA_WITH_INVITAE = `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
  ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR = 'Additional Consent: Learning About Your Tumor Columns',
  ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE = 'Additional Consent: Learning More About Your DNA with Invitae Columns',
  ADDITIONAL_DETAILS = 'Additional details Columns',
  BIOLOGICAL_PARENT_FEMALE = `Biological / Birth Parent 1: Assigned female at birth Columns`,
  BIOLOGICAL_PARENT_MALE = `Biological / Birth Parent 2: Assigned male at birth Columns`,
  CHILD = 'Child Columns',
  CLINICAL_ORDERS = 'Clinical Orders Columns',
  COHORT_TAGS = 'Cohort Tags Columns',
  CONTACT_INFORMATION = 'Contact Information Columns',
  DIAGNOSIS_TYPE = 'Survey: Your Child\'s/Your [DIAGNOSIS TYPE] Columns',
  DSM_COLUMNS = 'Participant - DSM Columns',
  GENOME_STUDY = 'Genome Study Columns',
  GRANDPARENT = 'Grandparent Columns',
  HALF_SIBLING = 'Half-Sibling Columns',
  INVITAE = 'Invitae Columns',
  INVITATION = 'Invitation Columns',
  LOVED_ONE_SURVEY = 'Loved One Survey Columns',
  MEDICAL_RECORD = 'Medical Record Columns',
  MEDICAL_RELEASE_FORM = 'Medical Release Form Columns',
  ONC_HISTORY = 'Onc History Columns',
  PARENT_SIBLING = `Parent's Sibling Columns`,
  PARTICIPANT = 'Participant Columns',
  PARTICIPANT_DSM = 'Participant - DSM Columns',
  PARTICIPANT_INFO = 'Participant Info Columns',
  PREQUALIFIER_SURVEY = 'Prequalifier Survey Columns',
  PROVIDE_CONTACT_INFORMATION = 'Provide contact information Columns',
  PROXY = 'Proxy Columns',
  RESEARCH_CONSENT_ASSENT_FORM = 'Research Consent & Assent Form Columns',
  RESEARCH_CONSENT_FORM = 'Research Consent Form Columns',
  SAMPLE = 'Sample Columns',
  SIBLING = 'Sibling Columns',
  SURVEY_ABOUT_YOU_OR_YOUR_CHILD = `Survey: About your child/you Columns`,
  SURVEY_FAMILY_HISTORY_OF_CANCER = 'Survey: Family History of Cancer Columns',
  SURVEY_YOUR_CHILDS_OSTEOSARCOMA = `Survey: Your Child's Osteosarcoma Columns`,
  SURVEY_YOUR_CHILDS_OR_YOUR_OSTEOSARCOMA = `Survey: Your Child's/Your Osteosarcoma Columns`,
  TISSUE = 'Tissue Columns',
  WHAT_WE_LEARNED_FROM_SOMATIC_DNA = `What We’ve Learned from Your Child's/Your Tumor (somatic) DNA Columns`,
}

//The id attribute used by customize view columns
export enum CustomizeViewID {
  ADD_CHILD_PARTICIPANT = 'ADD_PARTICIPANT',
  ADDITIONAL_CONSENT_ASSENT_LEARN_ABOUT_CHILD_TUMOR = 'CONSENT_ADDENDUM_PEDIATRIC',
  ADDITIONAL_CONSENT_ASSENT_LEARN_CHILDS_DNA_WITH_INVITAE = 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC',
  ADDITIONAL_CONSENT_LEARN_ABOUT_DNA_WITH_INVITAE = 'GERMLINE_CONSENT_ADDENDUM',
  ADDITIONAL_CONSENT_LEARN_ABOUT_YOUR_TUMOR = 'CONSENT_ADDENDUM',
  ADDITIONAL_DETAILS = 'FAMILY_HISTORY_SELF_ADDITIONAL_DETAILS',
  BIOLOGICAL_PARENT_FEMALE = 'FAMILY_HISTORY_SELF_PARENT1',
  BIOLOGICAL_PARENT_MALE = 'FAMILY_HISTORY_SELF_PARENT2',
  CHILD = 'FAMILY_HISTORY_SELF_CHILD',
  CLINICAL_ORDER = 'cl',
  COHORT_TAG = 'c',
  CONTACT_INFORMATION = 'address',
  GRANDPARENT = 'FAMILY_HISTORY_SELF_GRANDPARENT',
  HALF_SIBLING = 'FAMILY_HISTORY_SELF_HALF_SIBLING',
  INVITATION = 'invitations',
  INVITAE = 'OSTEO2_INVITAE_TAB',
  MEDICAL_RECORD = 'm',
  MEDICAL_RELEASE_FORM_ADULT = 'RELEASE_SELF',
  MEDICAL_RELEASE_FORM_PEDIATRIC = 'RELEASE_MINOR',
  LOVED_ONE_SURVEY = 'LOVEDONE',
  ONC_HISTORY = 'oD',
  PARENTS_SIBLING = 'FAMILY_HISTORY_SELF_PARENT_SIBLING',
  PREQUALIFIER = 'PREQUAL',
  PROVIDE_CONTACT_INFORMATION = 'CHILD_CONTACT',
  PROXY = 'proxy',
  RESEARCH_CONSENT_ASSENT_FORM = 'CONSENT_ASSENT',
  RESEARCH_CONSENT_FORM_ADULT = 'CONSENT',
  RESEARCH_CONSENT_FORM_PARENTAL = 'PARENTAL_CONSENT',
  SAMPLE = 'k',
  SIBLING = 'FAMILY_HISTORY_SELF_SIBLING',
  SURVEY_ABOUT_YOU_OR_YOUR_CHILD = 'ABOUT_YOU_ACTIVITY',
  SURVEY_FAMILY_HISTORY_OF_CANCER = 'FAMILY_HISTORY_SELF',
  SURVEY_YOUR_CHILDS_OSTEO = 'ABOUTCHILD',
  SURVEY_YOUR_OR_YOUR_CHILDS_OSTEO = 'ABOUTYOU',
  TISSUE = 't',
  PARTICIPANT = 'data',
  PARTICIPANT_DSM = 'p',
  WHAT_WE_LEARNED_FROM_YOUR_DNA = 'SOMATIC_RESULTS',
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
  ABOUT_YOU_ACTIVITY_SURVEY_COMPLETED = 'ABOUT_YOU_ACTIVITY Survey Completed',
  ABOUT_YOU_ACTIVITY_SURVEY_CREATED = 'ABOUT_YOU_ACTIVITY Survey Created',
  ABOUT_YOU_ACTIVITY_SURVEY_LAST_UPDATED = 'ABOUT_YOU_ACTIVITY Survey Last Updated',
  ABOUT_YOU_ACTIVITY_SURVEY_STATUS = 'ABOUT_YOU_ACTIVITY Survey Status',
  ACCEPTED = 'Accepted',
  ACCEPTANCE_STATUS = 'Acceptance Status**',
  ACCEPTANCE_STATUS_DATE = 'Acceptance Status Date**',
  ACCESSION_NUMBER = 'Accession Number',
  AFFECTED_STATUS = 'Affected Status',
  AFRO_HISPANIC = 'AFRO_HISPANIC',
  AGE_TODAY = 'Age Today',
  ASSIGNEE = 'Assignee',
  BAM_FILE_RECEIVED_FROM_INVITAE = 'BAM file received from Invitae',
  BIRTH_SEX_ASSIGN = 'BIRTH_SEX_ASSIGN',
  BLOCK = 'Block(s)',
  BLOCK_TO_REQUEST = 'Block to Request', //Lower case usage in LMS -> Onc History columns
  BLOCK_TO_REQUEST_CAPITALIZED = 'BLOCK_TO_REQUEST', //Upper case usage in OS2 -> Onc History columns
  BLOCK_TO_SHL = 'Block to SHL',
  BLOCK_ID_TO_SHL = 'Block ID to SHL',
  BLOCKS_WITH_TUMOR = 'Blocks with Tumor',
  CITY = 'City',
  CLINICAL_ORDER_DATE = 'Clinical Order Date',
  CLINICAL_ORDER_ID = 'Clinical Order Id',
  CLINICAL_ORDER_PDO_NUMBER = 'Clinical Order PDO #',
  CLINICAL_ORDER_STATUS = 'Clinical Order Status',
  CLINICAL_ORDER_STATUS_DATE = 'Clinical Order Status Date',
  COLLABORATOR_PARTICIPANT_ID = 'Collaborator Participant ID',
  COLLABORATOR_SAMPLE_ID = 'Collaborator Sample ID',
  COLLECTION_DATE = 'Collection Date',
  COHORT_TAG_NAME = 'Cohort Tag Name',
  CONFIDENCE_LEVEL_ID = 'CONFIDENCE_LEVEL_ID',
  CONFIRMED_PHONE = 'Confirmed Phone',
  CONFIRMED_FAX = 'Confirmed Fax',
  CONFIRMED_INSTITUTION_NAME = 'Confirmed Institution Name',
  CONSENT_ADDENDUM_SURVEY_COMPLETED = 'CONSENT_ADDENDUM Survey Completed',
  CONSENT_ADDENDUM_SURVEY_CREATED = 'CONSENT_ADDENDUM Survey Created',
  CONSENT_ADDENDUM_SURVEY_LAST_UPDATED = 'CONSENT_ADDENDUM Survey Last Updated',
  CONSENT_ADDENDUM_SURVEY_STATUS = 'CONSENT_ADDENDUM Survey Status',
  CONSENT_ADDENDUM_SURVEY_PEDIATRIC_COMPLETED = 'CONSENT_ADDENDUM_PEDIATRIC Survey Completed',
  CONSENT_ADDENDUM_SURVEY_PEDIATRIC_CREATED = 'CONSENT_ADDENDUM_PEDIATRIC Survey Created',
  CONSENT_ADDENDUM_SURVEY_PEDIATRIC_LAST_UPDATED = 'CONSENT_ADDENDUM_PEDIATRIC Survey Last Updated',
  CONSENT_ADDENDUM_SURVEY_PEDIATRIC_STATUS = 'CONSENT_ADDENDUM_PEDIATRIC Survey Status',
  CONSENT_BLOOD = 'CONSENT_TISSUE',
  CONSENT_TISSUE = 'CONSENT_TISSUE',
  CONTACT_EMAIL = 'Contact Email',
  CONTACT_PERSON = 'Contact Person',
  COUNT_RECEIVED = 'Count Received',
  COUNTRY = 'Country',
  CREATED = 'Created',
  CURRENT_STATUS = 'Current Status',
  DATE_BAM_FILE_RECEIVED_FROM_INVITAE = 'Date BAM file received from Invitae',
  DATE_OF_BIRTH = 'Date of Birth',
  DATE_OF_DIAGNOSIS = 'Date of Diagnosis',
  DATE_OF_PX = 'Date of PX',
  DATE_OF_MAJORITY = 'Date of Majority',
  DATE_REPORT_RECEIVED_FROM_INVITAE = 'Date Report received from Invitae',
  DATE_SENT_TO_GP = 'Date sent to GP',
  DATE_SIGNED_UP = 'Date signed up',
  DATE_WITHDRAWN = 'Date Withdrawn',
  DEACTIVATED = 'Deactivated',
  DEACTIVATION_REASON = 'Deactivation Reason',
  DESTRUCTION_POLICY = 'Destruction Policy (years)',
  DIAGNOSIS_MONTH = 'Diagnosis Month',
  DIAGNOSIS_TYPE = 'DIAGNOSIS_TYPE',
  DIAGNOSIS_YEAR = 'Diagnosis Year',
  DOB = 'DOB',
  DO_NOT_CONTACT = 'Do Not Contact',
  DDP = 'DDP',
  DDP_REALM = 'DDP-Realm',
  DUPLICATE = 'Duplicate',
  EMAIL = 'Email',
  EMAIL_2 = 'E-Mail',
  ENROLLMENT_DATE = 'Enrollment Date**',
  ERROR_REASON = 'Error Reason',
  EXPECTED_NUMBER_TO_SEQUENCE = 'Expected # to Sequence',
  EXPECTED_RETURN_DATE = 'Expected Return Date',
  EXTENSIVE_TREATMENT_EFFECT = 'Extensive Treatment Effect',
  FACILITY = 'Facility',
  FACILITY_FAX = 'Facility Fax',
  FACILITY_PHONE = 'Facility Phone',
  FACILITY_WHERE_SAMPLE_WAS_REVIEWED = 'Facility where the sample was reviewed',
  FAMILY_HISTORY_SELF_CHILD_SURVEY_COMPLETED = 'FAMILY_HISTORY_SELF_CHILD Survey Completed',
  FAMILY_HISTORY_SELF_CHILD_SURVEY_CREATED = 'FAMILY_HISTORY_SELF_CHILD Survey Created',
  FAMILY_HISTORY_SELF_CHILD_SURVEY_LAST_UPDATED = 'FAMILY_HISTORY_SELF_CHILD Survey Last Updated',
  FAMILY_HISTORY_SELF_CHILD_SURVEY_STATUS = 'FAMILY_HISTORY_SELF_CHILD Survey Status',
  FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_COMPLETED = 'FAMILY_HISTORY_SELF_GRANDPARENT Survey Completed',
  FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_CREATED = 'FAMILY_HISTORY_SELF_GRANDPARENT Survey Created',
  FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_LAST_UPDATED = 'FAMILY_HISTORY_SELF_GRANDPARENT Survey Last Updated',
  FAMILY_HISTORY_SELF_GRANDPARENT_SURVEY_STATUS = 'FAMILY_HISTORY_SELF_GRANDPARENT Survey Status',
  FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_COMPLETED = 'FAMILY_HISTORY_SELF_HALF_SIBLING Survey Completed',
  FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_CREATED = 'FAMILY_HISTORY_SELF_HALF_SIBLING Survey Created',
  FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_LAST_UPDATED = 'FAMILY_HISTORY_SELF_HALF_SIBLING Survey Last Updated',
  FAMILY_HISTORY_SELF_HALF_SIBLING_SURVEY_STATUS = 'FAMILY_HISTORY_SELF_HALF_SIBLING Survey Status',
  FAMILY_HISTORY_SELF_SIBLING_SURVEY_COMPLETED = 'FAMILY_HISTORY_SELF_SIBLING Survey Completed',
  FAMILY_HISTORY_SELF_SIBLING_SURVEY_CREATED = 'FAMILY_HISTORY_SELF_SIBLING Survey Created',
  FAMILY_HISTORY_SELF_SIBLING_SURVEY_LAST_UPDATED = 'FAMILY_HISTORY_SELF_SIBLING Survey Last Updated',
  FAMILY_HISTORY_SELF_SIBLING_SURVEY_STATUS = 'FAMILY_HISTORY_SELF_SIBLING Survey Status',
  FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_COMPLETED = 'FAMILY_HISTORY_SELF_PARENT_SIBLING Survey Completed',
  FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_CREATED = 'FAMILY_HISTORY_SELF_PARENT_SIBLING Survey Created',
  FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_LAST_UPDATED = 'FAMILY_HISTORY_SELF_PARENT_SIBLING Survey Last Updated',
  FAMILY_HISTORY_SELF_PARENT_SIBLING_SURVEY_STATUS = 'FAMILY_HISTORY_SELF_PARENT_SIBLING Survey Status',
  FAMILY_ID = 'Family ID',
  FAMILY_NOTES = 'Family Notes',
  FAX = 'Fax',
  FAX_SENT = 'Fax Sent',
  FH_CHILD_AGE_RANGE = 'FH_CHILD_AGE_RANGE',
  FH_CHILD_CANCERS_LIST = 'FH_CHILD_CANCERS_LIST',
  FH_CHILD_HAD_CANCER = 'FH_CHILD_HAD_CANCER',
  FH_GRANDPARENT_AGE_RANGE = 'FH_GRANDPARENT_AGE_RANGE',
  FH_GRANDPARENT_CANCERS_LIST = 'FH_GRANDPARENT_CANCERS_LIST',
  FH_GRANDPARENT_HAD_CANCER = 'FH_GRANDPARENT_HAD_CANCER',
  FH_HALF_SIBLING_AGE_RANGE = 'FH_HALF_SIBLING_AGE_RANGE',
  FH_HALF_SIBLING_CANCERS_LIST = 'FH_HALF_SIBLING_CANCERS_LIST',
  FH_HALF_SIBLING_HAD_CANCER = 'FH_HALF_SIBLING_HAD_CANCER',
  FH_SIBLING_AGE_RANGE = 'FH_SIBLING_AGE_RANGE',
  FH_SIBLING_CANCERS_LIST = 'FH_SIBLING_CANCERS_LIST',
  FH_SIBLING_HAD_CANCER = 'FH_SIBLING_HAD_CANCER',
  FH_PARENT_SIBLING_AGE_RANGE = 'FH_PARENT_SIBLING_AGE_RANGE',
  FH_PARENT_SIBLING_CANCERS_LIST = 'FH_PARENT_SIBLING_CANCERS_LIST',
  FH_PARENT_SIBLING_HAD_CANCER = 'FH_PARENT_SIBLING_HAD_CANCER',
  FILE_UPLOAD_TIME = 'File Upload Time',
  FIRST_NAME = 'First Name',
  FIRST_SM_ID = 'First SM ID',
  FOLLOW_UP_REQUIRED = 'Follow-Up required',
  FOLLOW_UP_REQUIRED_TEXT = 'Follow-Up required Text',
  H_E_PLURAL = 'H&E(s)',
  H_E_SINGULAR = 'H&E',
  FULL_NAME = 'Full Name',
  GENDER = 'Gender',
  GENDER_IDENTITY = 'GENDER_IDENTITY',
  GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED = 'GERMLINE_CONSENT_ADDENDUM Survey Created',
  GERMLINE_CONSENT_STATUS = 'Germline Consent Status',
  GERMLINE_RETURN_NOTES_FIELD = 'Germline return notes field',
  GUID = 'Internal Participant ID',
  HIGHEST_LEVEL_SCHOOL_ID = 'HIGHEST_LEVEL_SCHOOL_ID',
  HISTOLOGY = 'Histology',
  HOW_DID_YOU_HEAR_ABOUT_THE_PROJECT = 'How did you hear about the project?',
  INDIGENOUS_NATIVE = 'INDIGENOUS_NATIVE',
  INCOMPLETE_OR_MINIMAL_MEDICAL_RECORDS = 'Incomplete/Minimal Medical Records',
  INSTITUTION = 'Institution',
  INSTITUTION_CONTACT_PERSON = 'Institution Contact Person',
  INSTITUTION_FAX = 'Institution Fax',
  INSTITUTION_INFO = 'Institution Info',
  INSTITUTION_NAME = 'Institution Name',
  INSTITUTION_PHONE = 'Institution Phone',
  INITIAL_MR_REQUEST = 'Initial MR Request',
  INITIAL_MR_REQUEST_TWO = 'Initial MR Request 2',
  INITIAL_MR_REQUEST_THREE = 'Initial MR Request 3',
  INITIAL_MR_RECEIVED = 'Initial MR Received',
  INTERNATIONAL = 'International',
  INVITATION_CODE = 'Invitation Code',
  IS_THIS_PERSON_CURRENTLY_LIVING = 'Is this person currently living?',
  KIT_UPLOAD_TYPE = 'Kit Upload Type',
  LAST_NAME = 'Last Name',
  LEGACY_PARTICIPANT_ID = 'Legacy Participant ID',
  LEGACY_SHORT_ID = 'Legacy Short ID',
  LOCAL_CONTROL = 'Is the sample from local control?',
  LOCATION_OF_PX = 'Location of PX',
  MAILING_ADDRESS = 'Your Mailing Address *',
  MAIL_TO_NAME = 'Mail To Name',
  MATERIALS_RECEIVED = 'Materials received',
  METHOD_OF_DECALCIFICATION = 'Method of decalcification',
  MF_BARCODE = 'MF Barcode',
  MF_CODE = 'MF code',
  MIXED_RACE = 'MIXED_RACE',
  MR_ASSIGNEE = 'MR Assignee',
  MR_DOCUMENT = 'MR Document',
  MR_DOCUMENT_FILE_NAMES = 'MR Document File Names',
  MR_FOLLOWUP_REQUIRED = 'MR Follow-Up Required',
  MR_NOTES = 'MR Notes',
  MR_PROBLEM = 'MR Problem',
  MR_PROBLEM_TEXT = 'MR Problem Text',
  MR_REVIEW = 'MR Review',
  MR_REQUIRES_REVIEW = 'MR Requires Review',
  MR_STATUS = 'MR Status',
  MR_UNABLE_TO_OBTAIN = 'MR Unable to Obtain',
  NAME_OR_NICKNAME = 'Name or nickname',
  NECROSIS = '% Necrosis',
  NO_ACTION_NEEDED = 'No Action Needed',
  NORMAL_COLLABORATOR_SAMPLE_ID = 'Normal Collaborator Sample ID',
  NOTES = 'Notes',
  ONC_HISTORY_CREATED = 'Onc History Created',
  ONC_HISTORY_DATE = 'Onc History Date',
  ONC_HISTORY_NOTES = 'OncHistory Notes',
  ONC_HISTORY_REVIEWED = 'Onc History Reviewed',
  OTHER_COMMENTS = 'OTHER_COMMENTS',
  PAPER_CR_RECEIVED = 'Paper C/R Received',
  PAPER_CR_REQUIRED = 'Paper C/R required',
  PAPER_CR_SENT = 'Paper C/R Sent',
  PARTICIPANT_ID = 'Participant ID',
  PARTICIPANT_LIST_CHECKBOX_HEADER = 'checkbox column', //filling out to make error messages more verbose - but header is actually blank
  PARTICIPANT_NOTES = 'Participant Notes',
  PATHOLOGY_REPORT = 'Pathology Report',
  PATHOLOGY_PRESENT = 'Pathology Present',
  PHONE = 'Phone',
  PHONE_PRIMARY = 'Phone (Primary)',
  PHYSICIAN = 'PHYSICIAN',
  PREFERRED_EMAIL = 'Preferred Email',
  PREFERRED_LANGUAGE = 'Preferred Language',
  PREQUAL_SELF_DESCRIBE = 'PREQUAL_SELF_DESCRIBE',
  PRINT_KIT = 'Print Kit',
  PROBLEM_WITH_TISSUE_COLUMN = 'Problem with Tissue', //Participant List column header does not have '?' (currently using exact match to check pt list column options)
  PROBLEM_WITH_TISSUE = 'Problem with Tissue?', //Used in Tissue Request page
  PROBLEM_UNDERSTANDING_WRITTEN_ID = 'PROBLEM_UNDERSTANDING_WRITTEN_ID',
  RACE_QUESTION = 'RACE-QUESTION',
  READY_FOR_ABSTRACTION = 'Ready for Abstraction',
  READ_HOSPITAL_MATERIALS_ID = 'READ_HOSPITAL_MATERIALS_ID',
  RECEIVED = 'Received',
  REGISTRATION_DATE = 'Registration Date',
  RELATIONSHIP_TO_PROBAND = 'Relationship to Proband',
  RELEASE_SELF = 'RELEASE_SELF',
  REQUEST = 'Request',
  REQUEST_STATUS = 'Request Status',
  RESULTS = 'Results',
  RETURN_DATE = 'Return Date',
  SAMPLE_DEACTIVATION = 'Sample Deactivation',
  SAMPLE_FFPE = 'Is the sample FFPE',
  SAMPLE_KIT_BARCODE = 'Sample kit barcode for genome study',
  SAMPLE_NOTES = 'Sample Notes',
  SAMPLE_RECEIVED = 'Sample Received',
  SAMPLE_SENT = 'Sample Sent',
  SAMPLE_TYPE = 'Sample Type',
  SCROLL = 'Scroll(s)',
  SCROLLS_BACK_FROM_SHL = 'Scrolls back from SHL',
  SELF_STATE = 'SELF_STATE',
  SENT = 'Sent',
  SEQR_PROJECT = 'Seqr project',
  SEQUENCING_RESTRICTIONS = 'Sequencing Restriction',
  SEQUENCING_RESULTS = 'Sequencing Results',
  SHIPPING_ID = 'Shipping ID',
  SHL_WORK_NUMBER = 'SHL Work Number',
  SHORT_ID = 'Short ID',
  SIGNATURE = 'Signature:',
  SIGNATURE_WITHOUT_COLON = 'Signature',
  SK_ID = 'SK ID',
  SLIDES_TO_REQUEST = 'Slides to Request',
  SM_ID_FOR_H_E = 'SM ID for H&E',
  SM_ID_VALUE = 'SM-ID value',
  SOMATIC_ASSENT_ADDENDUM = 'SOMATIC_ASSENT_ADDENDUM',
  SOMATIC_CONSENT_STATUS = 'Somatic Consent Status',
  SOMATIC_CONSENT_TUMOR = 'SOMATIC_CONSENT_TUMOR',
  SOMATIC_CONSENT_TUMOR_PREDIATRIC = 'SOMATIC_CONSENT_TUMOR_PEDIATRIC',
  SOMATIC_RESULTS_SURVEY_CREATED = 'SOMATIC_RESULTS Survey Created',
  SPECIALITY_PROJECT_CAGI_2022 = 'Speciality Project: CAGI 2022',
  SPECIALITY_PROJECT_CAGI_2023 = 'Speciality Project: CAGI 2023',
  SPECIALITY_PROJECT_CZI = 'Speciality Project: CZI',
  SPECIALITY_PROJECT_R21 = 'Speciality Project: CZI',
  STATUS = 'Status',
  STATE = 'State',
  STREET_ONE = 'Street 1',
  STREET_TWO = 'Street 2',
  SUBJECT_ID = 'Subject ID',
  TOTAL_NUMBER_SLIDES_MENTIONED = 'Total number of slides mentioned',
  TISSUE_ASSIGNEE = 'Tissue Assignee',
  TISSUE_NOTES = 'Tissue Notes',
  TISSUE_RECEIVED = 'Tissue Received',
  TISSUE_REQUEST_DATE = 'Tissue Request Date',
  TISSUE_REQUEST_DATE_TWO = 'Tissue Request Date 2',
  TISSUE_REQUEST_DATE_THREE = 'Tissue Request Date 3',
  TISSUE_SITE = 'Tissue Site',
  TISSUE_TYPE = 'Tissue Type',
  TRACKING_IN = 'Tracking-in',
  TRACKING_OUT = 'Tracking-out',
  TRACKING_NUMBER = 'Tracking Number',
  TRACKING_RETURN = 'Tracking Return',
  TYPE = 'Type',
  TYPE_OF_PX = 'Type of PX',
  TUMOR_COLLABORATOR_SAMPLE_ID = 'Tumor Collaborator Sample ID',
  TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL = 'Tumor Percentage as reported by SHL',
  TUMOR_SIZE = 'Tumor Size',
  TUMOR_TYPE = 'Tumor Type',
  UNABLE_TO_OBTAIN = 'Unable to Obtain',
  UPLOADED_FILE_NAME = 'Uploaded File Name',
  USS_UNSTAINED = 'USS (unstained slides)',
  VALID = 'Valid',
  VERIFIED = 'Verified',
  VIABLE_TUMOR = '% Viable Tumor',
  VOCAB_CHECK = 'VOCAB_CHECK',
  VOIDED = 'Voided',
  WHAT_IS_THIS_PERSONS_SEX_ASSIGNED_AT_BIRTH = `What is this person's sex assigned at birth?`,
  WHAT_LANGUAGE_DO_YOU_SPEAK_AT_HOME = 'What language do you speak at home?',
  WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON = 'Which side of the family is this person on?',
  ZIP = 'Zip',
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

export enum SM_ID {
  USS_SM_IDS = 'USS SM-IDS',
  SCROLLS_SM_IDS = 'scrolls SM-IDS',
  H_E_SM_IDS = 'H&E SM-IDS',
}

export enum TissueType {
  SLIDE = 'Slide',
  BLOCK = 'Block',
  SCROLLS = 'Scrolls'
}

export enum ErrorMessage {
  NOT_ELIGIBLE_FOR_CLINICAL_SEQUENCING_NY_OR_CA = `Error: Participant lives in New York or Canada and is not eligible for clinical sequencing`,
  ONC_HISTORY_TAB_CONSENT_TISSUE_NO = 'This participant did not consent to sharing tissue',
}
