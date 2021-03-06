import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
  selector: 'toolkit-error',
  template: `
      <toolkit-header [showButtons]="false"></toolkit-header>
      <div class="Wrapper">
      <div class="PageHeader">
        <div class="PageHeader-background">
          <div class="PageLayout">
            <div class="row NoMargin">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h1 class="PageHeader-title" translate>
                  Toolkit.ErrorPage.Title
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
        <article class="PageContent">
          <div class="PageLayout">
            <div class="row NoMargin">
              <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                      <a [href]="phoneHref" class="Link" *ngIf="phone">{{ phone }}</a>
                      <span *ngIf="phone">.</span>
                    </ng-container>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
    </div>`
})
export class ErrorComponent implements OnInit {
  @Input() public errorText: string;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
  }
}
