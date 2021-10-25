import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ActivityDynamicSelectQuestionBlock } from '../../../../models/activity/activityDynamicSelectQuestionBlock';
import { ActivityDynamicOption } from '../../../../models/activity/activityDynamicOption';
import { DynamicSelectAnswerService } from '../../../../services/serviceAgents/dynamicSelectAnswer.service';
import { CompositeDisposable } from '../../../../compositeDisposable';

@Component({
  selector: 'ddp-activity-dynamic-select-answer',
  templateUrl: './activity-dynamic-select-answer.component.html',
  styleUrls: ['./activity-dynamic-select-answer.component.scss'],
})
export class ActivityDynamicSelectAnswer implements OnInit, OnDestroy {
  @Input() block: ActivityDynamicSelectQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<string | null>();
  @Output() componentBusy = new EventEmitter<boolean>();
  public options$ = new BehaviorSubject<ActivityDynamicOption[]>([]);
  private panelOpen$ = new Subject<void>();
  private subs = new CompositeDisposable();

  constructor(private dynamicSelectAnswerService: DynamicSelectAnswerService) {}

  ngOnInit(): void {
    this.initListeners();

    this.getOptions().subscribe();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  onSelectionChange(option: ActivityDynamicOption): void {
    this.valueChanged.emit(option.answerGuid);
  }

  onOpen(): void {
    this.panelOpen$.next();
  }

  compare(option: ActivityDynamicOption, answerGuid: string): boolean {
    return option.answerGuid === answerGuid;
  }

  private initListeners(): void {
    this.initPanelOpenListener();
  }

  private initPanelOpenListener(): void {
    const sub = this.panelOpen$
      .pipe(switchMap(() => this.getOptions()))
      .subscribe();

    this.subs.addNew(sub);
  }

  private getOptions(): Observable<ActivityDynamicOption[]> {
    this.componentBusy.next(true);

    return this.dynamicSelectAnswerService.getOptions(this.block.stableId).pipe(
      tap(options => {
        this.options$.next(options);
        this.componentBusy.next(false);
      }),
    );
  }
}
