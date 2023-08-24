import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
    selector: 'app-participation-section',
    templateUrl: './participation-section.component.html',
    styleUrls: ['./participation-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipationSectionComponent {
    @Input() isColorectalTheme: boolean;
    @Input() isPediHCCTheme: boolean;

    readonly AppRoutes = AppRoutes;
    readonly participationStepsImages = [
        'step1.png',
        'step2.png',
        'step3.png',
        'step4.png'
    ];
}
