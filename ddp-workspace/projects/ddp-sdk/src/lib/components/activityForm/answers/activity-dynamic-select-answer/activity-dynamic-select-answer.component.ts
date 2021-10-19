import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ActivityDynamicSelectQuestionBlock } from '../../../../models/activity/activityDynamicSelectQuestionBlock';
import { CompositeDisposable } from '../../../../compositeDisposable';
import { DynamicSelectAnswerService } from '../../../../services/serviceAgents/dynamicSelectAnswer.service';

@Component({
  selector: 'ddp-activity-dynamic-select-answer',
  templateUrl: './activity-dynamic-select-answer.component.html',
  styleUrls: ['./activity-dynamic-select-answer.component.scss'],
})
export class ActivityDynamicSelectAnswerComponent implements OnInit, OnDestroy {
  @Input() block: ActivityDynamicSelectQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<string | null>();
  @Output() componentBusy = new EventEmitter<boolean>();
  public options$ = new BehaviorSubject<string[]>([]);
  private focus$ = new Subject<void>();
  private subs = new CompositeDisposable();

  constructor(
    private dynamicSelectAnswerService: DynamicSelectAnswerService,
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
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
    const sub = this.focus$
      .pipe(
        tap(() => {
          this.componentBusy.next(true);
        }),
        switchMap(() =>
          this.dynamicSelectAnswerService.getOptions(this.block.stableId),
        ),
      )
      .subscribe(options => {
        this.options$.next(options);
        this.componentBusy.next(false);
      });

    this.subs.addNew(sub);
  }
}
