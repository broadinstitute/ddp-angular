import {Component} from '@angular/core';

@Component({
  selector: 'app-all-studies',
  template: `
    <app-navigation></app-navigation>
    <div class="Router--Outlet">
      <router-outlet></router-outlet>
    </div>
  `
})

export class AllStudiesComponent {}
