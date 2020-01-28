import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { ErrorComponent } from './error.component';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
  selector: 'toolkit-error-redesigned',
  template: `
    <main class="main">
      <section class="section static-page-title-section">
        <div class="content content_tight">
          <h1 translate>Toolkit.ErrorPage.Title</h1>
        </div>
      </section>
      <section class="section static-page-content-section">
        <div class="content content_tight">
          <p translate>Toolkit.ErrorPage.Text</p>
          <p>
            <ng-container *ngIf="errorText">
              <span [innerHTML]="errorText"></span>
            </ng-container>
            <ng-container *ngIf="!errorText">
              <span translate>Toolkit.ErrorPage.DefaultText.TextPt1</span>
              <a [href]="emailHref" class="Link">{{ email }}</a>
              <span translate>Toolkit.ErrorPage.DefaultText.TextPt2</span>
              <a [href]="phoneHref" class="Link">{{ phone }}</a>.
            </ng-container>
          </p>
        </div>
      </section>
    </main>`
})
export class ErrorRedesignedComponent extends ErrorComponent implements OnInit {
  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(toolkitConfiguration);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.headerConfig.setupDefaultHeader();
  }
}
