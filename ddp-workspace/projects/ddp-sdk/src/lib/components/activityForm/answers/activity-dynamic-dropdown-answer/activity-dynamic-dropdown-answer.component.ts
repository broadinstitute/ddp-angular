import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ActivityDynamicDropdownQuestionBlock } from '../../../../models/activity/activityDynamicDropdownQuestionBlock';

@Component({
  selector: 'ddp-activity-dynamic-dropdown-answer',
  templateUrl: './activity-dynamic-dropdown-answer.component.html',
  styleUrls: ['./activity-dynamic-dropdown-answer.component.scss'],
})
export class ActivityDynamicDropdownAnswer implements OnInit {
  @Input() block: ActivityDynamicDropdownQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<string | null>();
  private focus$ = new Subject<void>();

  ngOnInit(): void {
    this.initListeners();
  }

  onSelectionChange(value: string): void {
    this.valueChanged.emit(value);
  }

  onFocus(): void {
    this.focus$.next();
  }

  private initListeners(): void {
    this.initFocusListener();
  }

  private initFocusListener(): void {
    this.focus$.pipe(
      tap(() => {
        console.log('Select focused!');
      }),
    );
  }
}
