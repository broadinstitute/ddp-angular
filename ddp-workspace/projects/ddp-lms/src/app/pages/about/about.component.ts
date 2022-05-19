import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  readonly Route = Route;
}
