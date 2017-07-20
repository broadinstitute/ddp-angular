import { Component } from '@angular/core';
import {UmbrellaConfig} from "./umbrella-config/umbrella-config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  public umbrellaConfig:UmbrellaConfig = new UmbrellaConfig('cmi','v1',null);
}
