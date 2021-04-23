import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../model/questionBlockDef';
import { FormBuilder } from '@angular/forms';
import { TextQuestionDef } from '../model/textQuestionDef';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-text-question-editor',
  templateUrl: './text-question-editor.component.html',
  styleUrls: ['./text-question-editor.component.scss']
})
export class TextQuestionEditorComponent implements OnInit, OnDestroy {
  questionBlockSubject: BehaviorSubject<QuestionBlockDef | null> = new BehaviorSubject(null);
  @Input()
  set questionBlock(questionBlock: QuestionBlockDef) {
    this.questionBlockSubject.next(questionBlock);
  }

  formGroup = this.fb.group({
    inputType: [''],
    stableId: [''],
    required: [false]
  });
  private sub: Subscription;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const updateFormPipe = this.questionBlockSubject.pipe(
        filter(block => !!block),
        map(block => block.question),
        tap(question => this.updateForm(question as TextQuestionDef))
    );
    const updateQuestionPipe = this.formGroup.valueChanges.pipe(
        tap(formData => this.updateQuestion(formData))
    );
    this.sub = merge(updateFormPipe, updateQuestionPipe).subscribe();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private updateForm(question: TextQuestionDef): void {
    this.formGroup.patchValue({
      inputType: question.inputType,
      guid: question.stableId,
      required: question.validations.some(val => val.ruleType === 'REQUIRED')
    });
  }

  private currentQuestion(): TextQuestionDef | null {
    return this.questionBlockSubject.getValue()?.question as TextQuestionDef;
  }

  private updateQuestion(formData: any): void {
    const question = this.currentQuestion();
    if (!question)return;
    question.inputType = formData.inputType;
    question.stableId = formData.stableId;
    question.validations = formData.required ? [{ruleType: 'REQUIRED', hintTemplate: null}] : [];
  }
}
