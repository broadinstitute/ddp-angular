import {Page} from '@playwright/test';
import Dropdown from 'lib/widget/dsm/dropdown';
import ParticipantListPage from 'pages/dsm/participantList-page';
import {MainMenuEnum} from './enums/mainMenu-enum';
import {StudyNavEnum} from './enums/studyNav-enum';
import {StudyEnum} from './enums/selectStudyNav-enum';
import {NavigationItems} from './navigation-types';
import {SamplesNavEnum} from './enums/samplesNav-enum';
import KitsWithoutLabelPage from 'pages/dsm/kitsWithoutLabel-page';
import InitialScanPage from 'pages/dsm/initialScan-page';
import FinalScanPage from 'pages/dsm/finalScan-page';
import KitUploadPage from "pages/dsm/kitUpload-page/kitUpload-page";
import {MiscellaneousEnum} from 'lib/component/dsm/navigation/enums/miscellaneousNav-enum';


type Selection = StudyNavEnum | StudyEnum | SamplesNavEnum | MiscellaneousEnum;

export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map<string, object>([[StudyNavEnum.PARTICIPANT_LIST, new ParticipantListPage(this.page)]]),
    samples: new Map<string, object>([
      [SamplesNavEnum.KITS_WITHOUT_LABELS, new KitsWithoutLabelPage(this.page)],
      [SamplesNavEnum.INITIAL_SCAN, new InitialScanPage(this.page)],
      [SamplesNavEnum.FINAL_SCAN, new FinalScanPage(this.page)],
      [SamplesNavEnum.KIT_UPLOAD, new KitUploadPage(this.page)],
    ])
  };

  constructor(private readonly page: Page) {}

  public async selectStudy(studyName: StudyEnum): Promise<void> {
    await this.selectFrom(MainMenuEnum.SELECTED_STUDY, studyName);
  }

  public async selectFromSamples<T extends object>(sampleNav: SamplesNavEnum): Promise<T> {
    await this.selectFrom(MainMenuEnum.SAMPLES, sampleNav);
    return (this.navigationItems.samples as Map<string, object>).get(sampleNav) as T;
  }

  public async selectFromStudy<T extends object>(studyNav: StudyNavEnum): Promise<T> {
    await this.selectFrom(MainMenuEnum.STUDY, studyNav);
    return (this.navigationItems.study as Map<string, object>).get(studyNav) as T;
  }

  private async selectFrom(from: MainMenuEnum, selection: Selection): Promise<void> {
    await new Dropdown(this.page, from).selectOption(selection);
  }

  public async selectMiscellaneous(miscName: MiscellaneousEnum): Promise<void> {
    await this.selectFrom(MainMenuEnum.MISCELLANEOUS, miscName);
  }
}
