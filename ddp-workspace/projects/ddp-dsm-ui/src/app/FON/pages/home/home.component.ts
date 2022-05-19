import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<h1>Hello fon</h1>`,
  styles: [`
    :host-context(app-home) {
      grid-area: otherPage
    }
  `]
})

export class HomeComponent {
}
