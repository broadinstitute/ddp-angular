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
    .mainHolder {
      display: grid;
      grid-template-columns: 200px auto;
      column-gap:30px;
      height: 100vh;
      width: 100%;
      margin: 0;
      padding: 0;
      grid-template-areas: "asideNavigation otherPage";
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

export class FonComponent{
  constructor() {}
}
