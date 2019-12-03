import { Component, Inject } from '@angular/core';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';

@Component({
  selector: 'toolkit-common-landing',
  template: `
  <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

  <ng-template #newDesign>
    <toolkit-redesigned-header [showMainButtons]="false"
                               [showCmiButton]="false"
                               [showDashboardButton]="false">
    </toolkit-redesigned-header>
    <main class="main">
      <section class="section section-spinner">
          <div class="content content_medium info-block">
              <mat-spinner></mat-spinner>
          </div>
      </section>
    </main>
  </ng-template>

  <ng-template #oldDesign>
    <toolkit-header [showButtons]="false"></toolkit-header>
    <div class="Wrapper">
        <div class="Login-landing-header">
        </div>
        <div class="center">
            <div class="mat-subheading-2" translate>
              Toolkit.LoginLanding.Text
            </div>
            <mat-spinner></mat-spinner>
        </div>
    </div>
  </ng-template>`,
  styles: [
    `.center {
        margin: 10px 0;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 450px;
    }
    .info-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 0 0 0;
    }`
  ]
})

export class CommonLandingComponent {
  public useRedesign: boolean;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
    this.useRedesign = this.toolkitConfiguration.enableRedesign;
  }
}
