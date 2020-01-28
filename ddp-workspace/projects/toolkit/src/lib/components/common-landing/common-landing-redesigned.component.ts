import { Component, OnInit } from '@angular/core';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
  selector: 'toolkit-common-landing-redesigned',
  template: `
    <main class="main">
      <section class="section section-spinner">
          <div class="content content_medium info-block">
              <mat-spinner></mat-spinner>
          </div>
      </section>
    </main>`,
})

export class CommonLandingRedesignedComponent implements OnInit {
  constructor(private headerConfig: HeaderConfigurationService) { }

  public ngOnInit(): void {
    this.headerConfig.setupLoginLandingHeader();
  }
}
