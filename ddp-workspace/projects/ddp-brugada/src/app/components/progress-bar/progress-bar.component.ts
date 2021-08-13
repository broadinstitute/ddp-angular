import { Component, Input, OnInit } from '@angular/core';
import { Activity } from '../../interfaces/activity';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  activeActivityNumber: number;

  @Input() activities: Activity[];
  @Input() activeActivityId: number;

  constructor() {}

  ngOnInit(): void {
    const activeActivity = this.activities.find(activity => activity.id === this.activeActivityId);
    this.activeActivityNumber = this.activities.indexOf(activeActivity);
  }
}
