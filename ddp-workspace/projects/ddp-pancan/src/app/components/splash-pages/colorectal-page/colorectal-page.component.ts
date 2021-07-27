import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-colorectal-page',
    templateUrl: './colorectal-page.component.html',
    styleUrls: ['./colorectal-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorectalPageComponent {
    phone: string;
    email: string;
    readonly AppRoutes = AppRoutes;

    constructor(@Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService) {
        this.phone = config.colorectalPagePhone;
        this.email = config.colorectalPageEmail;
    }
}
