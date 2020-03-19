import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  inHome: boolean = true;

  constructor(private router: Router) {
    router.events.subscribe(e => this.trackNav(e));
  }

  ngOnInit() {
  }

  trackNav(evt) {
    this.currentPath(evt.urlAfterRedirects);
  }

  currentPath(rt: string) {
    if (rt == null || rt == undefined || rt.indexOf('/home') == 0 || rt.indexOf('/password') == 0) {

      this.inHome = true;
      return;
    }

    this.inHome = false;
  }

  toTop() {
    window.scrollTo(0, 0);
  }
}
