import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
    selector: 'app-join-cmi-section',
    templateUrl: './join-cmi-section.component.html',
    styleUrls: ['./join-cmi-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinCmiSectionComponent {
    readonly AppRoutes = AppRoutes;
}
