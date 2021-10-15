import { Component } from '@angular/core';

import { PasswordComponent as TKPasswordComponent } from 'toolkit';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent extends TKPasswordComponent {}
