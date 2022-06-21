import {Component, OnInit} from '@angular/core';
import {SessionMementoService} from "../../../../ddp-sdk/src/lib/services/sessionMemento.service";
import {Title} from "@angular/platform-browser";
import {JwtHelperService} from "@auth0/angular-jwt";
import {SessionService} from "../services/session.service";
import {MainConstants} from "./constants/main-constants";
import {StoreService} from "../STORE/store.service";
import {TranslateService} from "@ngx-translate/core";


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

export class FonComponent implements OnInit {
  constructor(private storeService: StoreService,
              private translateService: TranslateService,
              private sessionService: SessionService,
              private dssSessionService: SessionMementoService,
              private title: Title,
              private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    const LOCALE = 'en';

    // Title
    this.title.setTitle('Fon');


    // Store
    this.storeService.setStudy = MainConstants.study;
    this.storeService.dispatchGetSettings(MainConstants.participantsListParent);

    // Translation
    this.translateService.setDefaultLang(LOCALE);
    this.translateService.use(LOCALE);

    // Token
    const DSMToken = this.sessionService.getDSMToken();
    const userGuid = this.jwtHelper.decodeToken(DSMToken)['https://datadonationplatform.org/cid'];
    this.sessionService.setExpirationTime(DSMToken);
    this.dssSessionService.setSession(null, DSMToken, userGuid, LOCALE, +this.sessionService.getTokenExpiration());
  }
}
