import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
    selector: 'app-colorectal-page',
    templateUrl: './colorectal-page.component.html',
    styleUrls: ['./colorectal-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorectalPageComponent {
    readonly AppRoutes = AppRoutes;
}
