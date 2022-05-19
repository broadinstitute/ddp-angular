import {Component} from "@angular/core";

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
      grid-template-columns: 17% 80%;
      height: 100vh;
      column-gap: 1%;
      width: 100%;
      margin: 0;
      padding: 0;
      grid-template-areas: "sidebarNavigation otherPage";
    }

    router-outlet {
      grid-area: otherPage;
    }
  `]
})

export class FonComponent {}
