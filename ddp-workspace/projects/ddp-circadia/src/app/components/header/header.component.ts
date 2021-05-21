import { Component, HostListener } from '@angular/core';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  Route = Route;
  isSticky = false;

  @HostListener('document:scroll')
  private onScroll(): void {
    this.isSticky = window.pageYOffset > 0;
  }
}
