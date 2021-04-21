import { Component, Input, OnInit } from '@angular/core';
import { ActivityDef } from '../model/activityDef';

@Component({
  selector: 'app-survey-canvas',
  templateUrl: './survey-canvas.component.html',
  styleUrls: ['./survey-canvas.component.scss']
})
export class SurveyCanvasComponent implements OnInit {
  @Input() activity: ActivityDef | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
