import { Component } from '@angular/core';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-stay-informed',
  templateUrl: './stay-informed.component.html',
  styleUrls: ['./stay-informed.component.scss'],
})
export class StayInformedComponent {
  Route = Route;
}
