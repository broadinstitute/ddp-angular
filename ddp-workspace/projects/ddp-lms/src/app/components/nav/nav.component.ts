import {Component} from '@angular/core';
import { Route } from '../../constants/Route';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  readonly Route = Route;
}
