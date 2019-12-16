import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
  selector: 'toolkit-error',
  template: `
  <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

  <ng-template #newDesign>
    <main class="main">
      <section class="section static-page-title-section">
        <div class="content content_tight">
          <h1 translate>Toolkit.ErrorPage.Title</h1>
        </div>
      </section>
      <section class="section error-content-section">
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
    </main>
  </ng-template>

  <ng-template #oldDesign>
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
                      <a [href]="phoneHref" class="Link">{{ phone }}</a>.
                    </ng-container>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </article>
    </div>
  </ng-template>
  `
})
export class ErrorComponent implements OnInit {
  @Input() public errorText: string;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public useRedesign: boolean;

  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
    this.useRedesign = this.toolkitConfiguration.enableRedesign;
    this.headerConfig.setupDefaultHeader();
  }
}
