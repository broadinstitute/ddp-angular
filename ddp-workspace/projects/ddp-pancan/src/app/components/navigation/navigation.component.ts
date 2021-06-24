import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-navigation',
    template: `
    <nav>
        <ul class="navigation">
            <li class="navigation__item">
                <a class="navigation__link" [routerLink]="AppRoutes.AboutUs" routerLinkActive="header-link_active" translate>
                    App.Navigation.AboutUs
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" [routerLink]="AppRoutes.Participation" routerLinkActive="header-link_active" translate>
                    App.Navigation.Participation
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" [routerLink]="AppRoutes.ScientificResearch" routerLinkActive="header-link_active" translate>
                    App.Navigation.ScientificResearch
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" [routerLink]="AppRoutes.FAQ" routerLinkActive="header-link_active" translate>
                    App.Navigation.FAQ
                </a>
            </li>
        </ul>
    </nav>`,
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
    readonly AppRoutes = AppRoutes;
}
