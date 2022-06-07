import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SessionService} from "../services/session.service";
import {SessionMementoService} from "ddp-sdk";
import {Auth} from "../services/auth.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

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

export class FonComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  private readonly SESSION_KEY: string = 'session_key';

  constructor(private title: Title,
              private sessionService: SessionService,
              private dssSessionService: SessionMementoService,
              private authService: Auth,
              private translateService: TranslateService) {
    title.setTitle('Fon');
  }

  ngOnInit() {
    this.authService.dsmToken.pipe(takeUntil(this.unsubscribe))
      .subscribe(token => token && this.setDssSession(token))

    this.translateService.setDefaultLang('en');
    this.translateService.use('en')
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
  }

  private setDssSession(dsmToken: string): void {
    const accessToken = null;
    const userGuid = null;
    const locale = 'en';
    const expiresAtInSeconds: number = +this.sessionService.getTokenExpiration();
    // set DSS Session partially
    this.dssSessionService.setSession(accessToken, dsmToken, userGuid, locale, expiresAtInSeconds);
  }
}
