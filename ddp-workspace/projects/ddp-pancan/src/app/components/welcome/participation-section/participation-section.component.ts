import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
    selector: 'app-participation-section',
    templateUrl: './participation-section.component.html',
    styleUrls: ['./participation-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipationSectionComponent {
    @Input() withBackground: boolean;

    readonly AppRoutes = AppRoutes;
    /* the numeration of images is not in order because 2d step is skipped here
        in comparison with full (5) steps on Participation page */
    readonly participationStepsImages = [
        'step1.png',
        'step3.png',
        'step4.png',
        'step5.png'
    ];
}
