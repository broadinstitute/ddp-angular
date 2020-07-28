import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  template: `
    <prion-header currentRoute="/privacy-policy"></prion-header>
    <ddp-privacy-policy-static></ddp-privacy-policy-static>`,
})
export class PrivacyPolicyComponent {
}
