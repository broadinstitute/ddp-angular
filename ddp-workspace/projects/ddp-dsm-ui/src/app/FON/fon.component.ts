import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-fon',
  template: `
    <div class="mainHolder">
      <h1 class="header">Fontan Outcomes Network</h1>
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .mainHolder {
      display: grid;
      grid-template-columns: 230px auto;
      height: 100vh;
      column-gap: 50px;
      width: 100%;
      margin: 0;
      padding: 0;
      grid-template-areas: ". header" "sidebarNavigation otherPage";
    }

    .header {
      grid-area: header;
      height: 100px;
      line-height: 100px;
      margin: 0;
    }

    app-navigation {
      grid-area: sidebarNavigation
    }

    router-outlet {
      grid-area: otherPage;
    }
  `]
})

export class FonComponent {
  constructor(private title: Title) {
    title.setTitle('Fon');
  }
}
