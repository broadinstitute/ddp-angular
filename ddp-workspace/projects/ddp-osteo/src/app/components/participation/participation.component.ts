import {Component, Inject} from '@angular/core';
import {HeaderConfigurationService, ToolkitConfigurationService} from "toolkit";
import {NavigationEnd, Router} from "@angular/router";
import {config} from "../../app.module";

declare const gtag: (...args: any[]) => void;

@Component({
    selector: 'app-participation',
    templateUrl: './participation.component.html',
    styleUrls: ['./participation.component.scss']
})
export class ParticipationComponent {
    constructor(
        private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                console.log('Emitting navigation event: {} to TAG: {}', event.url, config.projectGAToken);
                gtag('config', config.projectGAToken, {page_path: event.url});
            }
        });
    }

    readonly stepsHref = [
        'consent.pdf',
        'medical_release.pdf',
        'surveys.pdf',
        'Kit_Instructions.pdf',
        'tumor_samples.pdf'
    ];

    readonly stepsHrf = [
        '',
        'tumor_samples.pdf',
    ];
}
