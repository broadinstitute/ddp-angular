import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ActivityInstanceSelectQuestionBlock } from '../../../../models/activity/activityInstanceSelectQuestionBlock';
import { ActivityInstanceSelectOptionDto } from '../../../../models/activity/activityInstanceSelectOptionDto';
import { ActivityInstanceSelectAnswerService } from '../../../../services/serviceAgents/activityInstanceSelectAnswer.service';
import { CompositeDisposable } from '../../../../compositeDisposable';

@Component({
  selector: 'ddp-activity-instance-select-answer',
  templateUrl: './activity-instance-select-answer.component.html',
  styleUrls: ['./activity-instance-select-answer.component.scss'],
})
export class ActivityInstanceSelectAnswer implements OnInit, OnDestroy {
  @Input() block: ActivityInstanceSelectQuestionBlock;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<string | null>();
  @Output() componentBusy = new EventEmitter<boolean>();
  public options$ = new BehaviorSubject<ActivityInstanceSelectOptionDto[]>([]);
  private panelOpen$ = new Subject<void>();
  private subs = new CompositeDisposable();

  constructor(private activityInstanceSelectAnswerService: ActivityInstanceSelectAnswerService) {}

  ngOnInit(): void {
    this.initListeners();

    this.getOptions().subscribe();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  onSelectionChange(option: ActivityInstanceSelectOptionDto): void {
    this.block.answer = option.guid;

    this.valueChanged.emit(this.block.answer);
  }

  onOpen(): void {
    this.panelOpen$.next();
  }

  compare(option: ActivityInstanceSelectOptionDto, answerGuid: string): boolean {
    return option.guid === answerGuid;
  }

  private initListeners(): void {
    this.initPanelOpenListener();
  }

  private initPanelOpenListener(): void {
    const sub = this.panelOpen$.pipe(switchMap(() => this.getOptions())).subscribe();

    this.subs.addNew(sub);
  }

  private getOptions(): Observable<ActivityInstanceSelectOptionDto[]> {
    this.componentBusy.next(true);

    return this.activityInstanceSelectAnswerService.getOptions(this.block.stableId).pipe(
      tap(options => {
        this.options$.next(options);
        this.componentBusy.next(false);
      }),
    );
  }
}
