import { Component } from '@angular/core';
import { Auth0Mode } from 'ddp-sdk';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: [
    `.example-fill-remaining-space {
        flex: 1 1 auto;
      }`,
    `.welcomeCard {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -150px;
        margin-left: -150px;
        width: 300px;
        height: 300px;
    }​`
  ]
})
export class WelcomeComponent {
  public auth0Mode: Auth0Mode = Auth0Mode.SignupAndLogin;
}
