import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import {
  ActivityMatrixQuestionBlock,
  Group,
  Option,
  RenderMode,
} from '../../../../models/activity/activityMatrixQuestionBlock';
import { ActivityMatrixAnswerDto } from '../../../../models/activity/activityMatrixAnswerDto';
import { ActivityMatrixAnswerDialogComponent } from './activity-matrix-answer-dialog/activity-matrix-answer-dialog.component';

interface RenderGroup extends Group {
  colSpan: number;
  options: Option[];
}

export interface DialogData {
  renderGroups: RenderGroup[];
  block: ActivityMatrixQuestionBlock;
  readonly: boolean;
  valueChanged: (answer: ActivityMatrixAnswerDto[]) => void;
}

@Component({
  selector: 'ddp-activity-matrix-answer',
  templateUrl: './activity-matrix-answer.component.html',
  styleUrls: ['./activity-matrix-answer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityMatrixAnswer implements OnChanges {
  @Input() block: ActivityMatrixQuestionBlock;
  @Input() readonly: boolean;
  @Output() valueChanged = new EventEmitter<ActivityMatrixAnswerDto[]>();

  RenderMode = RenderMode;
  renderGroups: RenderGroup[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block) {
      const block = changes.block.currentValue;

      this.renderGroups = this.getRenderGroups(block);
    }
  }

  onValueChange(answer: ActivityMatrixAnswerDto[]): void {
    this.valueChanged.emit(answer);
  }

  onOpenModalClick(): void {
    this.openDialog();
  }

  openDialog(): void {
    const data: DialogData = {
      block: this.block,
      readonly: this.readonly,
      renderGroups: this.renderGroups,
      valueChanged: this.onValueChange.bind(this),
    };

    this.dialog.open(ActivityMatrixAnswerDialogComponent, {
      data,
      width: '100%',
      maxWidth: 1600,
      maxHeight: 768,
      autoFocus: false,
      scrollStrategy: new NoopScrollStrategy(),
    });
  }

  private getRenderGroups({
    groups,
    options,
  }: ActivityMatrixQuestionBlock): RenderGroup[] {
    const renderGroups = groups.map(group => {
      const groupOptions = options.filter(
        option => option.groupId === group.identifier,
      );

      return {
        ...group,
        colSpan: groupOptions.length,
        options: groupOptions,
      };
    });

    return renderGroups;
  }
}
