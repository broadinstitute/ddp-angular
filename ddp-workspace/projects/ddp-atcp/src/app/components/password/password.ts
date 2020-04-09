import { Component } from '@angular/core';

@Component({
  selector: 'app-password',
  template: `
    <div class="password-page">
      <app-header></app-header>
      <div>
        <toolkit-password-redesigned></toolkit-password-redesigned>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./password.scss']
})
export class PasswordComponent {
}
