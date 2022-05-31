import {Component} from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  readonly Route = Route;
  currentYear: number = new Date().getFullYear();

  scrollTop(): void {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
}
