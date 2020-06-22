import { Component, Inject, Input, OnInit } from '@angular/core';
import { ErrorComponent, ToolkitConfigurationService } from "toolkit";

@Component({
  selector: 'toolkit-error',
  template: `
  <toolkit-header></toolkit-header>
  <div class="Wrapper">
  <article class="PageContent">
    <div class="PageLayout">
      <div class="row NoMargin">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <h1 translate>
              Toolkit.ErrorPage.Title
            </h1>
          <section class="PageContent-section">
            <h1 class="PageContent-title" translate>
              Toolkit.ErrorPage.Header
            </h1>
            <div class="PageContent-text">
              <ng-container *ngIf="errorText">
                <span [innerHTML]="errorText"></span>
              </ng-container>
              <ng-container *ngIf="!errorText">
                <span translate>Toolkit.ErrorPage.DefaultText.TextPt1</span>
                <a [href]="emailHref" class="Link">{{ email }}</a>
                <span translate>Toolkit.ErrorPage.DefaultText.TextPt2</span>
              </ng-container>
            </div>
          </section>
        </div>
      </div>
    </div>
  </article>
</div>
  `
})
export class PrionErrorComponent extends ErrorComponent implements OnInit {
  @Input() public errorText: string;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
    super(_toolkitConfiguration);
  }

  public ngOnInit(): void {
    this.email = this._toolkitConfiguration.infoEmail;
    this.emailHref = `mailto:${this._toolkitConfiguration.infoEmail}`;
  }
}
