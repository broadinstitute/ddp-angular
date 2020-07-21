import { Component } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  public appRoutes = AppRoutes;
}
