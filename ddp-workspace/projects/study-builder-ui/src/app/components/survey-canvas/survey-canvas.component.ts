import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityDef } from '../../model/activityDef';
import { BehaviorSubject } from 'rxjs';
import { QuestionBlockDef } from '../../model/questionBlockDef';
import { QuestionDef } from '../../model/questionDef';
import { TextQuestionDef } from '../../model/textQuestionDef';

@Component({
  selector: 'app-survey-canvas',
  templateUrl: './survey-canvas.component.html',
  styleUrls: ['./survey-canvas.component.scss']
})
export class SurveyCanvasComponent implements OnChanges {
  activitySubject = new BehaviorSubject<ActivityDef | null>(null);
  @Input()
  set activity(newActivity: ActivityDef) {
    console.log("updating activitydef from input");
    this.activitySubject.next(newActivity);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this + " got a new activity def!!");
  }

}
