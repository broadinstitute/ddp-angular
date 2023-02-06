import {Page} from '@playwright/test';
import Dropdown from 'lib/widget/dsm/dropdown';
import ParticipantListPage from 'pages/dsm/participantList-page';
import {MainMenu} from './enums/mainMenu.enum';
import {StudyNav} from './enums/studyNav.enum';
import {Study} from "./enums/selectStudyNav.enum";
import {NavigationItems} from "./navigation-types";


export class Navigation {
  private readonly navigationItems: Partial<NavigationItems> = {
    study: new Map([
      [StudyNav.PARTICIPANT_LIST, new ParticipantListPage(this.page)]
    ]),
  };

  constructor(private readonly page: Page) {}

  public async selectStudy(studyName: Study): Promise<void> {
    await this.selectFrom<object>(MainMenu.SELECTED_STUDY, studyName);
  }

  async selectFromStudy<T extends object>(studyNav: StudyNav): Promise<T> {
    await this.selectFrom<T>(MainMenu.STUDY, studyNav);
    return ((this.navigationItems.study as Map<string, object>).get(studyNav) as T);
  }

  private async selectFrom<T extends object>(from: MainMenu, selection: Study | StudyNav): Promise<void> {
    await new Dropdown(this.page, from).selectOption(selection);
  }
}
