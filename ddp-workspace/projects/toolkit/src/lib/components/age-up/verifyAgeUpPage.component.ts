import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
  selector: 'toolkit-verify-age-up-page',
  template: `
    <main class="main">
        <section class="section section-spinner">
            <div class="content content_medium">
                <ddp-verify-age-up (error)="handleError()"
                                   (nextUrl)="handleNextUrl($event)">
                </ddp-verify-age-up>
            </div>
        </section>
    </main>`
})
export class VerifyAgeUpPageComponent implements OnInit {
  constructor(
    private router: Router,
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.headerConfig.setupDefaultHeader();
  }

  public handleNextUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  public handleError(): void {
    this.router.navigateByUrl(this.toolkitConfiguration.errorUrl);
  }
}
