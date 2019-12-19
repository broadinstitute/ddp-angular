import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivityInstitutionBlock } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';

export interface PhysicianInfoParameters {
  allowMultiple: boolean;
  addButtonText: string;
  titleText: string;
  subtitleText: string;
  institutionType: string;
  studyGuid: string;
  readonly: boolean;
  showFieldsInitially: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sandbox-physician-info',
  templateUrl: 'physicianInfo.component.html'
})
export class PhysicianInfoComponent extends QuestionComponent<ActivityInstitutionBlock> {
  public allowMultiple: boolean;
  public addButtonText: string;
  public subtitleText: string;
  public institutionType: string;
  public titleText: string;
  public studyGuid: string;
  public readonly: boolean;
  public showFieldsInitially: boolean;

  constructor(private cdr: ChangeDetectorRef) {
    super();
    const parameters: PhysicianInfoParameters = {
      titleText: `<p>Your physician name</p>`,
      allowMultiple: true,
      addButtonText: '+ADD ANOTHER PHYSICIAN',
      subtitleText: `<p>subtitle sample text</p>`,
      institutionType: 'PHYSICIAN',
      studyGuid: 'TESTSTUDY1',
      readonly: false,
      showFieldsInitially: true
    };
    this.inputParameters = JSON.stringify(parameters, null, '\t');
    this.question = new ActivityInstitutionBlock();
    this.question.allowMultiple = parameters.allowMultiple;
    this.question.addButtonText = parameters.addButtonText;
    this.question.titleText = parameters.titleText;
    this.question.subtitleText = parameters.subtitleText;
    this.question.institutionType = parameters.institutionType;
    this.question.showFieldsInitially = parameters.showFieldsInitially;
    this.studyGuid = parameters.studyGuid;
    this.readonly = parameters.readonly;
  }

  public update(): void {
    this.cdr.detectChanges();
    try {
      const parameters: PhysicianInfoParameters = JSON.parse(this.inputParameters);
      this.question.allowMultiple = parameters.allowMultiple;
      this.question.addButtonText = parameters.addButtonText;
      this.question.titleText = parameters.titleText;
      this.question.subtitleText = parameters.subtitleText;
      this.question.institutionType = parameters.institutionType;
      this.question.showFieldsInitially = parameters.showFieldsInitially;
      this.studyGuid = parameters.studyGuid;
      this.readonly = parameters.readonly;
      this.validationMessage = null;
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }
}
