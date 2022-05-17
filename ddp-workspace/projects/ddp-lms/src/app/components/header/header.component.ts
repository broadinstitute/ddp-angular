import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly Route = Route;
}
