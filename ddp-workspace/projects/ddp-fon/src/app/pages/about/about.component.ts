import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-about-us',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  Route = Route;
}
