import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html'
})
export class AboutUsComponent {
    routerLink = AppRoutes.AboutUs;
}
