import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
    selector: 'app-join-cmi-section',
    templateUrl: './join-cmi-section.component.html',
    styleUrls: ['./join-cmi-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinCmiSectionComponent {
    @Input() isColorectalTheme: boolean;
    @Input() isPediHCCTheme: boolean;
    @Input() title = 'App.HomePage.CountMeInSection.Title';
    @Input() text = 'App.HomePage.CountMeInSection.Text';
    @Input() btnText = 'App.HomePage.JoinCountMeInButton';
    readonly AppRoutes = AppRoutes;
}
