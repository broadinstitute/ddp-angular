import { Component } from '@angular/core';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  routes = Route;
  broadUrl = 'https://www.broadinstitute.org/';
}
