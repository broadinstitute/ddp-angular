import { Component, Input, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../model/questionBlockDef';

@Component({
  selector: 'app-text-question-editor',
  templateUrl: './text-question-editor.component.html',
  styleUrls: ['./text-question-editor.component.scss']
})
export class TextQuestionEditorComponent implements OnInit {
  @Input()questionBlock: QuestionBlockDef;

  constructor() { }

  ngOnInit(): void {
  }

}
