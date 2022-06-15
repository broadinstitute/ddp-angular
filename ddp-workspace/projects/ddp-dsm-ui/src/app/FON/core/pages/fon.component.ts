import { Component } from '@angular/core';

@Component({
  selector: 'app-fon',
  template: `
    <mat-drawer-container class="main-container">
      <mat-drawer mode="side" opened>
        <app-navigation></app-navigation>
      </mat-drawer>
      <mat-drawer-content>
        <h1 class="header">Fontan Outcomes Network</h1>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [
    `
      .main-container {
        width: 100vw;
        height: 100vh;
      }
    `,
  ],
})
export class FonComponent {
  constructor() {}
}
