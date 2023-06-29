import {APIRequestContext, Page} from '@playwright/test';
import Dropdown from 'dsm/component/dropdown';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { waitForNoSpinner } from 'utils/test-utils';
import {MainMenuEnum} from 'dsm/component/navigation/enums/mainMenu-enum';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {NavigationItems} from 'dsm/component/navigation/navigation-types';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import FinalScanPage from 'dsm/pages/scanner-pages/finalScan-page';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {MiscellaneousEnum} from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';


type Selection = StudyNavEnum | StudyEnum | SamplesNavEnum | MiscellaneousEnum;

export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map<string, object>([[StudyNavEnum.PARTICIPANT_LIST, new ParticipantListPage(this.page)]]),
    samples: new Map<string, object>([
      [SamplesNavEnum.KITS_WITHOUT_LABELS, new KitsWithoutLabelPage(this.page)],
      [SamplesNavEnum.INITIAL_SCAN, new InitialScanPage(this.page)],
      [SamplesNavEnum.TRACKING_SCAN, new TrackingScanPage(this.page)],
      [SamplesNavEnum.FINAL_SCAN, new FinalScanPage(this.page)],
      [SamplesNavEnum.KIT_UPLOAD, new KitUploadPage(this.page)],
      [SamplesNavEnum.SENT, new KitsSentPage(this.page)],
      [SamplesNavEnum.RECEIVED, new KitsReceivedPage(this.page, this.request)],
    ])
  };

  constructor(private readonly page: Page, private readonly request: APIRequestContext) {}

  public async selectStudy(studyName: StudyEnum): Promise<void> {
    await this.selectMenu(MainMenuEnum.SELECTED_STUDY, studyName);
  }

  public async selectFromSamples<T extends object>(sampleNav: SamplesNavEnum): Promise<T> {
    await this.selectMenu(MainMenuEnum.SAMPLES, sampleNav);
    await waitForNoSpinner(this.page);
    return (this.navigationItems.samples as Map<string, object>).get(sampleNav) as T;
  }

  public async selectFromStudy<T extends object>(studyNav: StudyNavEnum): Promise<T> {
    await this.selectMenu(MainMenuEnum.STUDY, studyNav);
    return (this.navigationItems.study as Map<string, object>).get(studyNav) as T;
  }

  public async selectMiscellaneous(miscName: MiscellaneousEnum): Promise<void> {
    await this.selectMenu(MainMenuEnum.MISCELLANEOUS, miscName);
  }

  public async selectMenu(from: MainMenuEnum, selection: Selection): Promise<void> {
    await new Dropdown(this.page, from).selectOption(selection);
    await waitForNoSpinner(this.page);
  }
}
