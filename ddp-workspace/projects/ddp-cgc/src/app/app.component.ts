import { Route } from './constants/route';
import { Component } from '@angular/core';
import { Mode } from './components/header/enums.ts/header-mode';
import { RouterUtil } from './util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Route = Route;
  title = 'ddp-cgc';

  getHeaderMode(): Mode {
    return RouterUtil.isRoute(Route.Home)
      ? Mode.OVERLAY 
      : Mode.STANDARD;
  }
}
