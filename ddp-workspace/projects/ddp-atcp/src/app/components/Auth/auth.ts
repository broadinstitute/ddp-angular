import { Component } from '@angular/core';

@Component({
  selector: `app-auth`,
  template: `
    <div class="join-us">
      <div class="page-padding">
        <ddp-auth0-code-callback></ddp-auth0-code-callback>
      </div>
    </div>
  `
})
export class AuthComponent {
}
