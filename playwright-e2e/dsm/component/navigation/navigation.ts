import {APIRequestContext, Locator, Page, expect} from '@playwright/test';
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
import RgpFinalScanPage from 'dsm/pages/scanner-pages/rgpFinalScan-page';
import ErrorPage from 'dsm/pages/samples/error-page';
import UserPermissionPage from 'dsm/pages/miscellaneous-pages/user-and-permissions-page';
import KitsQueuePage from 'dsm/pages/kitsInfo-pages/kit-queue-page';
import { logInfo } from 'utils/log-utils';


type Selection = StudyNavEnum | StudyEnum | SamplesNavEnum | MiscellaneousEnum;

export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map<string, object>([[StudyNavEnum.PARTICIPANT_LIST, new ParticipantListPage(this.page)]]),
    samples: new Map<string, object>([
      [SamplesNavEnum.KITS_WITHOUT_LABELS, new KitsWithoutLabelPage(this.page)],
      [SamplesNavEnum.QUEUE, new KitsQueuePage(this.page)],
      [SamplesNavEnum.INITIAL_SCAN, new InitialScanPage(this.page)],
      [SamplesNavEnum.TRACKING_SCAN, new TrackingScanPage(this.page)],
      [SamplesNavEnum.FINAL_SCAN, new FinalScanPage(this.page)],
      [SamplesNavEnum.RGP_FINAL_SCAN, new RgpFinalScanPage(this.page)],
      [SamplesNavEnum.KIT_UPLOAD, new KitUploadPage(this.page)],
      [SamplesNavEnum.SENT, new KitsSentPage(this.page)],
      [SamplesNavEnum.RECEIVED, new KitsReceivedPage(this.page, this.request)],
      [SamplesNavEnum.ERROR, new ErrorPage(this.page)],
    ]),
    miscellaneous: new Map<string, object>([
      [MiscellaneousEnum.USERS_AND_PERMISSIONS, new UserPermissionPage(this.page)],
    ]),
  };

  constructor(private readonly page: Page, private readonly request: APIRequestContext) {}

  public async selectStudy(studyName: StudyEnum): Promise<void> {
    await this.selectFrom(MainMenuEnum.SELECTED_STUDY, studyName);
  }

  public async selectFromSamples<T extends object>(sampleNav: SamplesNavEnum): Promise<T> {
    await this.selectFrom(MainMenuEnum.SAMPLES, sampleNav);
    await waitForNoSpinner(this.page);
    return (this.navigationItems.samples as Map<string, object>).get(sampleNav) as T;
  }

  public async selectFromStudy<T extends object>(studyNav: StudyNavEnum): Promise<T> {
    await this.selectFrom(MainMenuEnum.STUDY, studyNav);
    return (this.navigationItems.study as Map<string, object>).get(studyNav) as T;
  }

  public async selectMiscellaneous(miscName: MiscellaneousEnum): Promise<void> {
    await this.selectFrom(MainMenuEnum.MISCELLANEOUS, miscName);
  }

  public async getDisplayedMainMenu(): Promise<MainMenuEnum[]> {
    let menuOptions: Locator[] = [];
    await expect(async () => {
      menuOptions = await this.page.locator(`//app-navigation//ul[1]//li[contains(@class, 'dropdown')]/a`).all();
      const countOfMenuOptions = menuOptions.length;
      logInfo(`Amount of main menu options: ${countOfMenuOptions}`);
      expect(countOfMenuOptions).toBeGreaterThanOrEqual(1);
    }).toPass({
      intervals: [5_000]
    });

    const displayedMenuOptions: MainMenuEnum[] = [];
    const selectedStudyText = MainMenuEnum.SELECTED_STUDY as string;
    for (const option of menuOptions) {
      let name = (await option.innerText()).trim();
      if (name.startsWith(selectedStudyText)) {
        name = selectedStudyText;
      }
      logInfo(`Main menu option: ${name}`);
      displayedMenuOptions.push(name as MainMenuEnum);
    }
    return displayedMenuOptions;
  }

  private async selectFrom(from: MainMenuEnum, selection: Selection): Promise<void> {
    await new Dropdown(this.page, from).selectOption(selection);
    await waitForNoSpinner(this.page);
  }
}
