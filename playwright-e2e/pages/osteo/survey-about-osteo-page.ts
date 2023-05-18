import { Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { OsteoPageBase } from 'pages/osteo/osteo-page-base';

export default class SurveyAboutOsteoPage extends OsteoPageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * <br> Question: When were you first diagnosed?
   * <br> Type: Locator
   */
  private firstDiagnosedMonth(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed/) })
    .toSelect('Choose month...')
    .toLocator();
  }

  /**
   * <br> Question: When were you first diagnosed with Cervical cancer?
   * <br> Type: Locator
   */
  private firstDiagnosedYear(): Locator {
    return new Question(this.page, { prompt: new RegExp(/When (were|was) (you|your child) first diagnosed/) })
    .toSelect('Choose year...')
    .toLocator();
  }

  async fillInDiagnosedDate(month: string, year: string) {
    await this.firstDiagnosedMonth().selectOption({ label: month });
    await this.firstDiagnosedYear().selectOption(year);
  }

  /**
   * <br> Question: When did you first experience symptoms from osteosarcoma?
   */
  async chooseTimeframe(option: string): Promise<void> {
    await new Question(this.page, { prompt: new RegExp(/When did you first experience symptoms/) })
    .toSelect('Choose timeframe...')
    .toLocator()
    .selectOption(option);
  }

  /**
   * <br> Question: Where in your body was it found?
   * <br> Type: Checkbox
   */
  initialBodyLocation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-INITIAL_BODY_LOC' });
    // return this.page.locator('.picklist-answer-INITIAL_BODY_LOC').locator('input');
  }

  /**
   * <br> Question: Please select all the places in your body that you currently have ...
   * <br> Type: Checkbox
   */
  currentBodyLocation(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CURRENT_BODY_LOC' });
  }

  /**
   * <br> Question: Have you had radiation as a treatment for Osteosarcoma
   * <br> Type: Radiobutton
   */
  hadRadiationAsTreatment(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-HAD_RADIATION' });
  }

  /**
   * <br> Question: Please check the therapies that you have ever received osteosarcoma
   * <br> Type: Checkbox
   * @returns {Question}
   */
  hadReceivedTherapies(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-THERAPIES_RECEIVED'});
  }

  /**
   * <br> Question: Are you currently being treated for osteosarcoma?
   * <br> Type: Radiobutton
   */
  isCurrentlyBeingTreated(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-CURRENTLY_TREATED'});
  }

  /**
   * <br> Question: Have you ever been diagnosed with any other cancer(s)?
   * <br> Type: Radiobutton
   */
  haveOtherCancer(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-OTHER_CANCERS'});
  }
}
