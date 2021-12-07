import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-verify-age-up',
  templateUrl: './verify-age-up.component.html',
  styleUrls: ['./verify-age-up.component.scss'],
})
export class VerifyAgeUpComponent {
  constructor(private router: Router) {}

  onError(): void {
    this.router.navigateByUrl(Route.Error);
  }

  onNextUrl(nextUrl: string): void {
    this.router.navigateByUrl(nextUrl);
  }
}
