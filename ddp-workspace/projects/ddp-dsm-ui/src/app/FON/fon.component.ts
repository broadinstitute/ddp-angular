import {Component} from '@angular/core';


@Component({
  selector: 'app-fon',
  template: `
    <div class="mainHolder">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    * {
      font-family: 'Montserrat', sans-serif;
    }

    .mainHolder {
      display: grid;
      grid-template-columns: 200px auto;
      height: 100vh;
      width: 100%;
      margin: 0;
      padding: 0;
      grid-template-areas: "asideNavigation otherPage";
    }

    app-navigation {
      grid-area: sidebarNavigation
    }

    router-outlet {
      grid-area: otherPage;
    }
  `]
})

export class FonComponent{
  constructor() {}
}
