import { Component } from '@angular/core';
import { Route } from '../../constants/Route';


@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent {
  Route = Route;
}
