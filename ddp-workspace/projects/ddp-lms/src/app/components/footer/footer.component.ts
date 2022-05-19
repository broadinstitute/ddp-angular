import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly Route = Route;
}
