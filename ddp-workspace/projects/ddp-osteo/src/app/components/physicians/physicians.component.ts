import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {config} from "../../app.module";

declare const gtag: (...args: any[]) => void;

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent {

      readonly stepsHrf = [
        'consent.pdf',
        'For_physician.pdf',
        'surveys.pdf',
        'Kit_Instructions.pdf',
        'tumor_samples.pdf'
    ];

    constructor(
        private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                console.log('Emitting navigation event: {} to TAG: {}', event.url, config.projectGAToken);
                gtag('config', config.projectGAToken, {page_path: event.url});
            }
        });
    }

}
