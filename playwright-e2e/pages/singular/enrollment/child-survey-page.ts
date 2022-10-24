import { Page } from '@playwright/test';
import { SingularPage } from 'pages/singular/singular-page';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import Select from 'lib/widget/select';

export default class ChildSurveyPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await this.cityBornIn().toLocator().waitFor({ state: 'visible' });
  }

  /**
   * <br> Question: What city did your child live in when they were born?
   * <br> Type: Input
   */
  cityBornIn(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CITY_BORN' });
  }

  /**
   * <br> Question: What state or province did your child live in when they were born?
   * <br> Type: Select
   */
  stateBornIn(): Select {
    return new Select(this.page, { label: 'Choose state' });
  }

  /**
   * <br> Question: If you remember, what was the zip code or postal code of the city you lived in when your child was born?
   * <br> Type: Input
   */
  zipCodeCityBornIn(): Input {
    return new Input(this.page, { ddpTestID: 'answer:ZIP_BORN_CITY' });
  }

  /**
   * <br> Question: What is your current zip code?
   * <br> Type: Input
   */
  currentZipCode(): Input {
    return new Input(this.page, { ddpTestID: 'answer:CURRENT_ZIP' });
  }

  /**
   * <br> Question: What was your child's recorded sex at birth?
   * <br> Type: Radiobutton
   */
  sexAtBirth(): Question {
    // eslint-disable-next-line
    return new Question(this.page, { prompt: 'What was your child\'s recorded sex at birth?' });
  }

  /**
   * <br> Question: What is your child's race?
   * <br> Type: Checkbox
   */
  race(): Question {
    return new Question(this.page, { prompt: 'race?' }); // Avoid the single-quote in text
  }

  /**
   * <br> Question: Is your child of Hispanic or Latino ethnicity?
   * <br> Type: Radiobutton
   */
  isHispanic(): Question {
    return new Question(this.page, { prompt: 'Is your child of Hispanic or Latino ethnicity?' });
  }

  /**
   * <br> Question: Select your child's single ventricle diagnosis from the list provided.*
   *         If you are unsure, choose your best guess or select other.
   * <br> Type: Radiobutton
   */
  selectVentricleDiagnosis(): Question {
    return new Question(this.page, {
      prompt: "Select your child's single ventricle diagnosis from the list provided."
    });
  }

  /**
   * <br> Question: What is your child's current height in feet and inches?
   * <br> Type: Input
   */
  heightInFeet(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_HEIGHT_FEET' });
  }

  /**
   * <br> Question: What is your child's current height in feet and inches?
   * <br> Type: Input
   */
  heightInInches(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_HEIGHT_INCHES' });
  }

  /**
   * <br> Question: What is your child's current weight in pounds?
   * <br> Type: Input
   */
  weightInPounds(): Input {
    return new Input(this.page, { ddpTestID: 'answer:WHAT_IS_YOUR_WEIGHT' });
  }

  /**
   * <br> Question: Has your child had any of the listed complications related to their heart disease or treatment?
   * <br> Type: Checkbox
   */
  listedComplicationRelatedToHeartDisease(): Question {
    return new Question(this.page, {
      prompt: 'Has your child had any of the listed complications related to their heart disease or treatment?'
    });
  }

  /**
   * <br> Question: If your child has had arrhythmia (heart rhythm) complications, please select how your child was medically treated.
   * <br> Type: Checkbox
   */
  hadArrhythmiaComplications(): Question {
    return new Question(this.page, {
      prompt:
        'If your child has had arrhythmia (heart rhythm) complications,' +
        ' please select how your child was medically treated.'
    });
  }

  /**
   * <br> Question: Has your child ever been on ECMO?
   * <br> Type: Radiobutton
   */
  onEcmo(): Question {
    return new Question(this.page, { prompt: 'Has your child ever been on ECMO?' });
  }

  /**
   * <br> Question: Has your child ever had a Ventricular Assist Device (VAD)?
   * <br> Type: Radiobutton
   */
  hadVad(): Question {
    return new Question(this.page, { prompt: 'Has your child ever had a Ventricular Assist Device (VAD)?' });
  }

  /**
   * <br> Question: Has your child received a heart transplant?
   * <br> Type: Radiobutton
   */
  hasReceivedHeartTransplant(): Question {
    return new Question(this.page, { prompt: 'Has your child received a heart transplant?' });
  }

  /**
   * <br> Question: Has your child received a liver transplant?
   * <br> Type: Radiobutton
   */
  hasReceivedLiverTransplant(): Question {
    return new Question(this.page, { prompt: 'Has your child received a liver transplant?' });
  }

  /**
   * <br> Question: Which of the following are true about your child's health in the past year?
   * <br> Type: Checkbox
   */
  aboutYourChildHealth(): Question {
    return new Question(this.page, {
      prompt: "Which of the following are true about your child's health in the past year?"
    });
  }

  /**
   * <br> Question: Which of the following are true about your child's health in the past year?
   * <br> Type: Checkbox
   */
  hasReceivedSupportOrTreatmentForBehavioralNeurodevelopmentalPsychologicalProblem(): Question {
    return new Question(this.page, {
      prompt:
        'Has your child ever received treatment or support for any form of emotional,' +
        ' behavioral, neurodevelopmental, or psychological problem?'
    });
  }

  /**
   * <br> Question: How would you describe your child's physical health?
   * <br> Type: Radiobutton
   */
  describePhysicalHealth(): Question {
    return new Question(this.page, { prompt: "How would you describe your child's physical health?" });
  }

  /**
   * <br> Question: How do you think your family or close friends would describe your child's physical health?
   * <br> Type: Radiobutton
   */
  familyDescribePhysicalHealth(): Question {
    return new Question(this.page, {
      prompt: "How do you think your family or close friends would describe your child's physical health?"
    });
  }

  /**
   * <br> Question: Has your child ever had any of the following conditions?
   * <br> Type: Checkbox
   */
  hasAnyConditions(): Question {
    return new Question(this.page, {
      prompt: 'Has your child ever had any of the following conditions?'
    });
  }

  /**
   * <br> Question: Has your child ever had a Neurodevelopmental or Neurocognitive Evaluation by a psychologist or other licensed professional?
   * <br> Type: Radiobutton
   */
  hadNeurodevelopmentalNeurocognitiveEvaluation(): Question {
    return new Question(this.page, {
      prompt: 'Has your child ever had a Neurodevelopmental or Neurocognitive Evaluation'
    });
  }

  /**
   * <br> Question: Has your child ever been diagnosed by a physician or licensed professional with any of the following?
   * <br> Type: Checkbox
   */
  hasDiagnosedWithAnyFollowings(): Question {
    return new Question(this.page, {
      prompt: 'Has your child ever been diagnosed by a physician or licensed professional with any of the following?'
    });
  }

  /**
   * <br> Question: Has your child received education support through school with an IEP or 504 Plan or early intervention services through their state or county?
   * <br> Type: Checkbox
   */
  hasReceivedEducationSupportThroughSchool(): Question {
    return new Question(this.page, {
      prompt:
        // eslint-disable-next-line max-len
        'Has your child received education support through school with an IEP or 504 Plan or early intervention services through their state or county?'
    });
  }

  /**
   * <br> Question: Has your child ever received treatment or support for any form of emotional, behavioral, neurodevelopmental, or psychological problem?
   * <br> Type: Radiobutton
   */
  hasReceivedTreatmentForEmotionalProblem(): Question {
    return new Question(this.page, {
      prompt:
        // eslint-disable-next-line max-len
        'Has your child ever received treatment or support for any form of emotional, behavioral, neurodevelopmental, or psychological problem?'
    });
  }
}
