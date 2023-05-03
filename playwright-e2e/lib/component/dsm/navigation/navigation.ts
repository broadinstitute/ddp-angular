import {Page} from '@playwright/test';
import Dropdown from 'lib/widget/dsm/dropdown';
import ParticipantListPage from 'pages/dsm/participantList-page';
import {MainMenu} from './enums/mainMenu.enum';
import {StudyNav} from './enums/studyNav.enum';
import {Study} from './enums/selectStudyNav.enum';
import {NavigationItems} from './navigation-types';
import {SamplesNav} from './enums/samplesNav';
import KitsWithoutLabelPage from 'pages/dsm/kitsWithoutLabel-page';
import InitialScanPage from 'pages/dsm/initialScan-page';
import FinalScanPage from 'pages/dsm/finalScan-page';
import {Miscellaneous} from 'lib/component/dsm/navigation/enums/miscellaneousNav.enum';


type Selection = StudyNav | Study | SamplesNav | Miscellaneous;

export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map<string, object>([[StudyNav.PARTICIPANT_LIST, new ParticipantListPage(this.page)]]),
    samples: new Map<string, object>([
      [SamplesNav.KITS_WITHOUT_LABELS, new KitsWithoutLabelPage(this.page)],
      [SamplesNav.INITIAL_SCAN, new InitialScanPage(this.page)],
      [SamplesNav.FINAL_SCAN, new FinalScanPage(this.page)],
    ])
  };

  constructor(private readonly page: Page) {}

  public async selectStudy(studyName: Study): Promise<void> {
    await this.selectFrom(MainMenu.SELECTED_STUDY, studyName);
  }

  public async selectFromSamples<T extends object>(sampleNav: SamplesNav): Promise<T> {
    await this.selectFrom(MainMenu.SAMPLES, sampleNav);
    return (this.navigationItems.samples as Map<string, object>).get(sampleNav) as T;
  }

  public async selectFromStudy<T extends object>(studyNav: StudyNav): Promise<T> {
    await this.selectFrom(MainMenu.STUDY, studyNav);
    return (this.navigationItems.study as Map<string, object>).get(studyNav) as T;
  }

  private async selectFrom(from: MainMenu, selection: Selection): Promise<void> {
    await new Dropdown(this.page, from).selectOption(selection);
  }

  public async selectMiscellaneous(miscName: Miscellaneous | string): Promise<void> {
    await this.selectFrom(MainMenu.MISCELLANEOUS, miscName);
  }
}
