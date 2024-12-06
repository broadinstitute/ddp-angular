import { Component, OnInit, Inject } from '@angular/core';
import { ToolkitConfigurationService, HeaderConfigurationService } from 'toolkit';
import {NavigationEnd, Router} from "@angular/router";
import {config} from "../../app.module";

declare const gtag: (...args: any[]) => void;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  public countMeInUrl: string;

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

    /*constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }
*/
  public ngOnInit(): void {
    this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
    this.headerConfig.setupDefaultHeader();
  }
}
