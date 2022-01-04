import { Injectable } from '@angular/core';

@Injectable()
export class Statics {
  public static HOME = 'home';
  public static PERMALINK = 'permalink';
  public static URL = '/';

  public static MEDICALRECORD = 'medicalRecord';
  public static TISSUELIST = 'tissueList';

  public static SHIPPING = 'shipping';
  public static SHIPPING_QUEUE = 'shippingQueue';
  public static SHIPPING_ERROR = 'shippingError';
  public static SHIPPING_SENT = 'shippingSent';
  public static SHIPPING_RECEIVED = 'shippingReceived';
  public static SHIPPING_OVERVIEW = 'shippingOverview';
  public static SHIPPING_DEACTIVATED = 'shippingDeactivated';
  public static SHIPPING_UPLOADED = 'shippingUploaded';
  public static SHIPPING_TRIGGERED = 'shippingTriggered';

  public static UNSENT_OVERVIEW = 'unsentOverview';
  public static SHIPPING_DASHBOARD = 'shippingDashboard';
  public static MEDICALRECORD_DASHBOARD = 'medicalRecordDashboard';
  public static DYNAMIC_DASHBOARD = 'dynamicDashboard';

  public static SURVEY_CREATION = 'surveyCreation';
  public static PARTICIPANT_EVENT = 'participantEvent';
  public static PARTICIPANT_EXIT = 'participantExit';
  public static MAILING_LIST = 'mailingList';
  public static DISCARD_SAMPLES = 'discardSamples';
  public static PDF_DOWNLOAD_MENU = 'pdfDownload';

  public static YES = 'yes';
  public static UNSENT = 'unsent';
  public static CSV_FILE_EXTENSION = '.csv';
  public static PDF_FILE_EXTENSION = '.pdf';
  public static TXT_FILE_EXTENSION = '.txt';
  public static DISPLAY_NONE = 'none';
  public static DISPLAY_BLOCK = 'block';
  public static COLOR_PRIMARY = 'primary';
  public static COLOR_WARN = 'warn';
  public static COLOR_BASIC = 'basic';
  public static COLOR_ACCENT = 'accent';
  public static COLOR_RESLOVED = 'resolved';

  public static HOME_URL: string = Statics.URL + Statics.HOME;
  public static MEDICALRECORD_URL: string = Statics.URL + Statics.MEDICALRECORD;
  public static TISSUEVIEW_URL: string = Statics.URL + Statics.TISSUELIST;
  public static PERMALINK_URL: string = Statics.URL + Statics.PERMALINK;
  public static SHIPPING_URL: string = Statics.URL + Statics.SHIPPING;
  public static UNSENT_OVERVIEW_URL: string = Statics.URL + Statics.UNSENT_OVERVIEW;
  public static SHIPPING_DASHBOARD_URL: string = Statics.URL + Statics.SHIPPING_DASHBOARD;
  public static MEDICALRECORD_DASHBOARD_URL: string = Statics.URL + Statics.MEDICALRECORD_DASHBOARD;
  public static SCAN_URL: string = Statics.URL + 'scan';
  public static TISSUE_URL: string = Statics.URL + 'tissue';
  public static PARTICIPANT_PAGE_URL: string = Statics.URL + 'participantPage';

  public static TISSUE_ALIAS = 't';
  public static ONCDETAIL_ALIAS = 'oD';
  public static ES_ALIAS = 'data';
  public static PT_ALIAS = 'p';
  public static MR_ALIAS = 'm';
  public static DRUG_ALIAS = 'd';
  public static DELIMITER_ALIAS = '.';

  public static EXITED = 'EXITED';
  public static CONSENT_SUSPENDED = 'CONSENT_SUSPENDED';

  public static RELATIONS = {
    BROTHER: 'Brother',
    DAUGHTER: 'Daughter',
    FATHER: 'Father',
    HALF_SIBLING_MATERNAL: 'Half Sibling (Maternal)',
    HALF_SIBLING_PATERNAL: 'Half Sibling (Paternal)',
    MATERNAL_AUNT: 'Maternal Aunt',
    MATERNAL_FIRST_COUSIN: 'Maternal First Cousin',
    MATERNAL_GRANDFATHER: 'Maternal Grandfather',
    MATERNAL_GRANDMOTHER: 'Maternal Grandmother',
    MATERNAL_UNCLE: 'Maternal Uncle',
    MOTHER: 'Mother',
    OTHER: 'Other',
    PATERNAL_AUNT: 'Paternal Aunt',
    PATERNAL_FIRST_COUSIN: 'Paternal First Cousin',
    PATERNAL_GRANDFATHER: 'Paternal Grandfather',
    PATERNAL_GRANDMOTHER: 'Paternal Grandmother',
    PATERNAL_UNCLE: 'Paternal Uncle',
    SELF: 'Self',
    SISTER: 'Sister',
    SON: 'Son'
  };

  public static PARTICIPANT_PROBAND = 'SELF';

  public static PARTICIPANT_RELATIONSHIP_ID = 'COLLABORATOR_PARTICIPANT_ID';
}
