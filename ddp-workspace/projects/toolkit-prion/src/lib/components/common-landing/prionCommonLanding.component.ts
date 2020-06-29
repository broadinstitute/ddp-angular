import { Component } from "@angular/core";
import { CommonLandingComponent } from "toolkit";


@Component({
  selector: 'prion-common-landing',
  template: `    
      <prion-header>
      </prion-header>
      <div class="Wrapper">
        <div class="center">
          <div class="mat-subheading-2" translate>
            Toolkit.LoginLanding.Text
          </div>
          <mat-spinner></mat-spinner>
        </div>
      </div>     
  `
})
export class PrionCommonLandingComponent extends CommonLandingComponent { }
