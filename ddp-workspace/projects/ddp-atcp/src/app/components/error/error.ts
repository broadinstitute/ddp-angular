import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="error-page">
      <app-header></app-header>
      <div>
        <toolkit-error-redesigned></toolkit-error-redesigned>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./error.scss']
})
export class ErrorComponent {
}
