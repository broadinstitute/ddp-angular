import { Component, Input, OnInit } from '@angular/core';
import { ObservableActivityDef } from '../model/observableActvityDef';

@Component({
  selector: 'app-survey-canvas',
  templateUrl: './survey-canvas.component.html',
  styleUrls: ['./survey-canvas.component.scss']
})
export class SurveyCanvasComponent implements OnInit {
  @Input() activity: ObservableActivityDef | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
