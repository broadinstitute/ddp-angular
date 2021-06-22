import { Component } from '@angular/core';

@Component({
    selector: 'app-navigation',
    template: `
    <nav>
        <ul class="navigation">
            <li class="navigation__item">
                <a class="navigation__link" routerLink="about-us" routerLinkActive="header-link_active" translate>
                    App.Navigation.AboutUs
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" routerLink="participation" routerLinkActive="header-link_active" translate>
                    App.Navigation.Participation
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" routerLink="scientific-research" routerLinkActive="header-link_active" translate>
                    App.Navigation.ScientificResearch
                </a>
            </li>
            <li class="navigation__item">
                <a class="navigation__link" routerLink="more-details" routerLinkActive="header-link_active" translate>
                    App.Navigation.FAQ
                </a>
            </li>
        </ul>
    </nav>`,
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {}
