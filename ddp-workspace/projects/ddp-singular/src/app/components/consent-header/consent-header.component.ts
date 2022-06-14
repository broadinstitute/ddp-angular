import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ProgressSteps } from '../../../../../ddp-sdk/src/lib/models/progressSteps';

@Component({
    selector: 'app-consent-header',
    templateUrl: './consent-header.component.html',
    styleUrls: ['./consent-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsentHeaderComponent {
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
