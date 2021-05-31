import { Component, Input } from '@angular/core';
import { Route } from '../../constants/route';
import { Mode } from './enums.ts/header-mode';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  Mode = Mode;
  Route = Route;
  isAuth = false;

  @Input() mode: Mode = Mode.STANDARD;

  toggleIsAuthenticated(): void {
    this.isAuth = true;
  }
}
