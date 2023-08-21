import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-pedihcc-page',
    templateUrl: './pedihcc-page.component.html',
    styleUrls: ['./pedihcc-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PediHCCPageComponent {
    phone: string;
    email: string;
    readonly AppRoutes = AppRoutes;

    constructor(@Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService) {
        this.phone = config.pediHCCPagePhone;
        this.email = config.pediHCCPageEmail;
    }
}
