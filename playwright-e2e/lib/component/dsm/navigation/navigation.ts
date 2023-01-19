import { Page } from '@playwright/test';
import Dropdown from 'lib/widget/dropdown';
import ParticipantListPage from 'pages/dsm/participantList-page';
import { MainMenu } from './enums/mainMenu.enum';
import { StudyNav } from './enums/studyNav.enum';

export class Navigation {
  private readonly navigationItems: any = {
    Study: { name: StudyNav.PARTICIPANT_LIST, Page: ParticipantListPage }
  };

  constructor(private readonly page: Page) {}

  async selectFromStudy<T extends object>(selection: string): Promise<T> {
    return await this.select<T>(MainMenu.STUDY, selection);
  }

  private async select<T extends object>(from: MainMenu, page: string): Promise<T> {
    await new Dropdown(this.page, from).selectOption(page, { waitForNav: true });
    return new this.navigationItems[from].Page(this.page);
  }
}
