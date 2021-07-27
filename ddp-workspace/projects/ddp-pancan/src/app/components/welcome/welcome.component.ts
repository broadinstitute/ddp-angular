import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {
    readonly AppRoutes = AppRoutes;
}
