import {APIRequestContext, Locator, Page, expect} from '@playwright/test';
import Dropdown from 'dsm/component/dropdown';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import KitsInitialScanPage from 'dsm/pages/scan/initial-scan-page';
import KitsFinalScanPage from 'dsm/pages/scan/final-scan-page';
import KitUploadPage from 'dsm/pages/kits-upload-page';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsReceivedPage from 'dsm/pages/kits-received-page';
import KitsTrackingScanPage from 'dsm/pages/scan/tracking-scan-page';
import RgpFinalScanPage from 'dsm/pages/scan/rgp-final-scan-page';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import UserPermissionPage from 'dsm/pages/user-and-permissions-page';
import KitsQueuePage from 'dsm/pages/kits-queue-page';
import {logInfo} from 'utils/log-utils';
import KitsSearchPage from 'dsm/pages/kits-search-page';
import SamplesClinicalOrdersPage from 'dsm/pages/clinical-orders-page';
import FollowUpSurveyPage from 'dsm/pages/follow-up-survey-page';
import ParticipantWithdrawalPage from 'dsm/pages/participant-withdrawal-page';
import MailingListPage from 'dsm/pages/mailing-list-page';
import OncHistoryUploadPage from 'dsm/pages/onc-history-upload-page';

export enum Menu {
  SELECTED_STUDY = 'Selected study',
  SAMPLES = 'Samples',
  STUDY = 'Study',
  MISCELLANEOUS = 'Miscellaneous'
}

export enum Miscellaneous {
  DOWNLOAD_PDF = 'Download PDF',
  DRUG_LIST = 'Drug List',
  FOLLOW_UP_SURVEY = 'Follow-Up Survey',
  MAILING_LIST = 'Mailing List',
  NDI_DOWNLOAD = 'NDI Download',
  ONC_HISTORY_UPLOAD = 'Onc History Upload',
  PARTICIPANT_WITHDRAWAL = 'Participant Withdrawal',
  PARTICIPANT_EVENT = 'Participant Event',
  USERS_AND_PERMISSIONS = 'Users And Permissions',
}

export enum Study {
  DASHBOARD = 'Dashboard',
  STATISTICS_DASHBOARD = 'Statistics Dashboard',
  PARTICIPANT_LIST = 'Participant List',
  TISSUE_LIST = 'Tissue List',
  FIELD_SETTINGS = 'Field Settings',
  MR_ABSTRACTION_SETTINGS = 'MR Abstraction Settings',
}

export enum Samples {
  UNSENT_KITS_OVERVIEW = 'Unsent Kits Overview',
  REPORT = 'Report',
  SUMMARY = 'Summary',
  KITS_WITHOUT_LABELS = 'Kits without Labels',
  QUEUE = 'Queue',
  ERROR = 'Error',
  INITIAL_SCAN = 'Initial Scan',
  TRACKING_SCAN = 'Tracking Scan',
  FINAL_SCAN = 'Final Scan',
  RGP_FINAL_SCAN = 'RGP Final Scan',
  RECEIVING_SCAN = 'Receiving Scan',
  SENT = 'Sent',
  RECEIVED = 'Received',
  SENT_RECEIVED_OVERVIEW = 'Sent/Received Overview',
  DEACTIVATED = 'Deactivated',
  SEARCH = 'Search',
  KIT_UPLOAD = 'Kit Upload',
  STOOL_SAMPLE_UPLOAD = 'Stool Sample Upload',
  LABEL_SETTINGS = 'Label Settings',
  CLINICAL_ORDERS = 'Clinical Orders'
}

export enum StudyName {
  AT = 'AT',
  BRUGADA = 'Brugada',
  BASIL = 'basil',
  ANGIO = 'Angio',
  BRAIN = 'Brain',
  DARWIN = `Darwin's Ark`,
  OSTEO = 'Osteo',
  MBC = 'MBC',
  PROSTATE = 'Prostate',
  ESC = 'ESC',
  PANCAN = 'PanCan',
  PRION = 'Prion',
  VOICES = 'Voices',
  LMS = 'Leiomyosarcoma',
  OSTEO2 = 'OS PE-CGS',
  RGP = 'RGP',
  RAREX = 'RareX',
  TEST_BOSTON = 'Test Boston'
}


type Selection = Study | StudyName | Samples | Miscellaneous;

type NavigationItems = {
  [s in 'selectStudy' | 'samples' | 'study' | 'miscellaneous' | 'userSettings' | 'logOut']: Map<string, object>;
};


export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map<string, object>([[Study.PARTICIPANT_LIST, new ParticipantListPage(this.page)]]),
    samples: new Map<string, object>([
      [Samples.KITS_WITHOUT_LABELS, new KitsWithoutLabelPage(this.page)],
      [Samples.QUEUE, new KitsQueuePage(this.page)],
      [Samples.INITIAL_SCAN, new KitsInitialScanPage(this.page)],
      [Samples.TRACKING_SCAN, new KitsTrackingScanPage(this.page)],
      [Samples.FINAL_SCAN, new KitsFinalScanPage(this.page)],
      [Samples.RGP_FINAL_SCAN, new RgpFinalScanPage(this.page)],
      [Samples.KIT_UPLOAD, new KitUploadPage(this.page)],
      [Samples.SENT, new KitsSentPage(this.page)],
      [Samples.RECEIVED, new KitsReceivedPage(this.page, this.request)],
      [Samples.ERROR, new KitsWithErrorPage(this.page)],
      [Samples.SEARCH, new KitsSearchPage(this.page)],
      [Samples.CLINICAL_ORDERS, new SamplesClinicalOrdersPage(this.page)],
    ]),
    miscellaneous: new Map<string, object>([
      [Miscellaneous.USERS_AND_PERMISSIONS, new UserPermissionPage(this.page)],
      [Miscellaneous.FOLLOW_UP_SURVEY, new FollowUpSurveyPage(this.page)],
      [Miscellaneous.PARTICIPANT_WITHDRAWAL, new ParticipantWithdrawalPage(this.page)],
      [Miscellaneous.MAILING_LIST, new MailingListPage(this.page)],
      [Miscellaneous.ONC_HISTORY_UPLOAD, new OncHistoryUploadPage(this.page)],
    ]),
  };

  constructor(private readonly page: Page, private readonly request: APIRequestContext) {}

  public async selectStudy(studyName: StudyName): Promise<void> {
    await this.selectFrom(Menu.SELECTED_STUDY, studyName);
  }

  public async selectFromSamples<T extends object>(sampleNav: Samples): Promise<T> {
    await this.selectFrom(Menu.SAMPLES, sampleNav);
    await waitForNoSpinner(this.page);
    return (this.navigationItems.samples as Map<string, object>).get(sampleNav) as T;
  }

  public async selectFromStudy<T extends object>(study: Study): Promise<T> {
    await this.selectFrom(Menu.STUDY, study);
    return (this.navigationItems.study as Map<string, object>).get(study) as T;
  }

  public async selectFromMiscellaneous<T extends object>(miscNav: Miscellaneous): Promise<T> {
    await this.selectFrom(Menu.MISCELLANEOUS, miscNav);
    return (this.navigationItems.miscellaneous as Map<string, object>).get(miscNav) as T;
  }

  public async getDisplayedMainMenu(): Promise<Menu[]> {
    let menuOptions: Locator[] = [];
    await expect(async () => {
      menuOptions = await this.page.locator(`//app-navigation//ul[1]//li[contains(@class, 'dropdown')]/a`).all();
      const countOfMenuOptions = menuOptions.length;
      logInfo(`Amount of main menu options: ${countOfMenuOptions}`);
      expect(countOfMenuOptions).toBeGreaterThanOrEqual(1);
    }).toPass({
      intervals: [5_000]
    });

    const displayedMenuOptions: Menu[] = [];
    const selectedStudyText = Menu.SELECTED_STUDY as string;
    for (const option of menuOptions) {
      let name = (await option.innerText()).trim();
      if (name.startsWith(selectedStudyText)) {
        name = selectedStudyText;
      }
      logInfo(`Main menu option: ${name}`);
      displayedMenuOptions.push(name as Menu);
    }
    return displayedMenuOptions;
  }

  private async selectFrom(from: Menu, selection: Selection): Promise<void> {
    switch (selection) {
      case Samples.INITIAL_SCAN:
      case Samples.TRACKING_SCAN:
      case Samples.FINAL_SCAN:
      case Samples.RGP_FINAL_SCAN:
      case Miscellaneous.USERS_AND_PERMISSIONS:
      case Samples.CLINICAL_ORDERS:
      case Miscellaneous.ONC_HISTORY_UPLOAD:
        await Promise.all([
          this.page.waitForLoadState(),
          new Dropdown(this.page, from).selectOption(selection),
        ]);
      break;
      default:
        await Promise.all([
          waitForResponse(this.page, { uri: 'ui/realmsAllowed' }),
          this.page.waitForLoadState(),
          new Dropdown(this.page, from).selectOption(selection),
        ]);
      break;
    }
    await waitForNoSpinner(this.page);
  }
}
