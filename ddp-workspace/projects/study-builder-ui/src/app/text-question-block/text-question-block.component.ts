import { Component, Input, OnInit } from '@angular/core';
import { QuestionBlockDef } from '../model/questionBlockDef';

@Component({
  selector: 'app-text-question-block',
  templateUrl: './text-question-block.component.html',
  styleUrls: ['./text-question-block.component.scss']
})
export class TextQuestionBlockComponent implements OnInit {
  @Input()block: QuestionBlockDef;

  constructor() { }

  ngOnInit(): void {
  }

}
