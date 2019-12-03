import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  public userName: string | null;

  constructor(private router: Router) { }

  public navigate(url: string): void {
    this.router.navigateByUrl(`activity?id=${url}`);
  }
}
