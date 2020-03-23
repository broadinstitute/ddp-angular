import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  inHome: boolean = true;

  constructor(private router: Router) {
    router.events.subscribe(e => this.trackNav(e));
  }

  trackNav(evt): void {
    this.currentPath(evt.urlAfterRedirects);
  }

  currentPath(rt: string): void {
    if (rt == null || rt == undefined || rt.indexOf('/home') == 0 || rt.indexOf('/password') == 0) {

      this.inHome = true;
      return;
    }

    this.inHome = false;
  }

  toTop(): void {
    window.scrollTo(0, 0);
  }
}
