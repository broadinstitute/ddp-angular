import { Component, Input, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../model/questionBlockDef';
import { FormBuilder } from '@angular/forms';
import { TextQuestionDef } from '../model/textQuestionDef';

@Component({
  selector: 'app-text-question-editor',
  templateUrl: './text-question-editor.component.html',
  styleUrls: ['./text-question-editor.component.scss']
})
export class TextQuestionEditorComponent implements OnInit {
  @Input()questionBlock: QuestionBlockDef;
  formGroup = this.fb.group({
    inputType: [''],
    stableId: [''],
    required: [false]
  });


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup.patchValue({
      inputType: this.question.inputType,
      guid: this.question.stableId,
      required: this.question.validations.some(val => val.ruleType === 'REQUIRED')
    });
    this.formGroup.valueChanges.subscribe(formData => this.updateQuestion(formData));
    console.log('The question block is: %o', this.questionBlock);
  }
  private get question(): TextQuestionDef {
    return this.questionBlock?.question as TextQuestionDef;
  }

  updateQuestion(formData: any): void {
    this.question.inputType = formData.inputType;
    this.question.stableId = formData.stableId;
    this.question.validations = formData.required ? [{ruleType: 'REQUIRED', hintTemplate: null}] : [];
  }
}
