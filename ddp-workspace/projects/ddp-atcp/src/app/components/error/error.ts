import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="error-page">
      <div>
        <toolkit-error-redesigned></toolkit-error-redesigned>
      </div>
    </div>
  `,
  styleUrls: ['./error.scss']
})
export class ErrorComponent {
}
