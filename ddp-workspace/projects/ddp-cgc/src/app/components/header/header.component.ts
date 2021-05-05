import { Component } from '@angular/core';
import { Route } from '../../constants/route';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  Route = Route;
}
