import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ProgressSteps } from '../../models/progressSteps';

/* Using the ddp-progress-indicator component.
   Define templates for every progress-bar step (in a template of a parent container component)
   and pass them as input 'steps' param into ddp-progress-indicator:

    <ng-template #step1><div class="page page__1">Page 1</div></ng-template>
    <ng-template #step2><div class="page page__2">Page 2</div></ng-template>
    <ng-template #step3><div class="page page__3">Page 3 (the last page)</div></ng-template>

    <div class="container">
        <ddp-progress-indicator
        (stepChanged)="handleStepChanged" // optionally
        (stepsCompleted)="handleStepsCompleted" // optionally
        [steps]="[
            { label: 'Step 1', template: step1 },
            { label: 'Step 2', template: step2 },
            { label: 'Step 3', template: step3 }
        ]">
        </ddp-progress-indicator>
    </div>
*/

@Component({
    selector: 'ddp-progress-indicator',
    templateUrl: './progress-indicator.component.html',
    styleUrls: ['./progress-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorComponent {
    @Input() steps: Array<ProgressSteps>;
    @Output() stepChanged = new EventEmitter<number>();
    @Output() stepsCompleted = new EventEmitter<boolean>();

    public onStepChanged(event: StepperSelectionEvent): void {
        this.stepChanged.emit(event.selectedIndex);
    }

    public finish(): void {
        this.stepsCompleted.emit(true);
    }
}
