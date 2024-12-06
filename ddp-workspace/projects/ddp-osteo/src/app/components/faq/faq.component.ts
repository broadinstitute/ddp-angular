import {Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatAccordion, MatExpansionPanel} from '@angular/material/expansion';
import {ToolkitConfigurationService, HeaderConfigurationService} from 'toolkit';
import {NavigationEnd, Router} from "@angular/router";
import {config} from "../../app.module";

declare const gtag: (...args: any[]) => void;

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
    public infoEmail: string;
    public phone: string;
    public infoEmailHref: string;
    public phoneHref: string;

    constructor(
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
        private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                console.log('Emitting navigation event: {} to TAG: {}', event.url, config.projectGAToken);
                gtag('config', config.projectGAToken, {page_path: event.url});
            }
        });
    }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.phone = this.toolkitConfiguration.phone;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.headerConfig.setupDefaultHeader();
    }




}
