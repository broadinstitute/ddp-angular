import { Component } from '@angular/core';

@Component({
  selector: 'toolkit-common-landing',
  template: `
  <toolkit-header></toolkit-header>
  <div class="Wrapper">
      <div class="Login-landing-header">
      </div>
      <div class="center">
          <div class="mat-subheading-2" translate>
             Toolkit.LoginLanding.Text
          </div>
          <mat-spinner></mat-spinner>
      </div>
  </div>`,
  styles: [
    `.center {
        margin: 10px 0;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 450px;
    }`
  ]
})

export class CommonLandingComponent {
}
