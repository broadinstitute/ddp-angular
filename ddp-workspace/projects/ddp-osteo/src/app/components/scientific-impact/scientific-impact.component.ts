import { Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {config} from "../../app.module";

declare const gtag: (...args: any[]) => void;

@Component({
  selector: 'app-scientific-impact',
  templateUrl: './scientific-impact.component.html',
  styleUrls: ['./scientific-impact.component.scss']
})
export class ScientificImpactComponent {

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
