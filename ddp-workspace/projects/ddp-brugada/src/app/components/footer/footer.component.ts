import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  Route = Route;

  onBackToTopClick(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
