import { Component } from '@angular/core';

@Component({
  selector: 'third-party',
  template: `
    <prion-header currentRoute="/3rd-party"></prion-header>
    <div class="Container">
      <p translate>App.ThirdParty.Description</p>
    </div>
    `
})
export class ThirdPartyComponent  {
  constructor() { }
}
