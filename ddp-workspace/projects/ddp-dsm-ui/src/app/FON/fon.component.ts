import {Component, OnInit} from '@angular/core';
import {SessionMementoService} from '../../../../ddp-sdk/src/lib/services/sessionMemento.service';
import {Title} from '@angular/platform-browser';
import {JwtHelperService} from '@auth0/angular-jwt';
import {SessionService} from '../services/session.service';
import {MainConstants} from './constants/main-constants';
import {TranslateService} from '@ngx-translate/core';
import {ParticipantsStoreService} from "../STORE/Participants/participantsStore.service";
import {DashboardStoreService} from "../STORE/Dashboard/dashboardStore.service";


@Component({
  selector: 'app-fon',
  template: `
    <div class="mainHolder" [gdColumns]="asideNavVisible? '200px auto' : '30px auto'">
      <app-navigation (toggleNav)="toggleAsideNav()"></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    * {
      font-family: 'Montserrat', sans-serif;
    }

    .mainHolder {
      display: grid;
      height: 100vh;
      width: 100%;
      margin: 0;
      padding: 0;
      grid-template-areas: "asideNavigation otherPage";
    }

    app-navigation {
      grid-area: asideNavigation;
    }

    router-outlet {
      grid-area: otherPage;
    }
  `]
})

export class FonComponent implements OnInit {
  asideNavVisible = true;

  constructor(private participantsStoreService: ParticipantsStoreService,
              private translateService: TranslateService,
              private sessionService: SessionService,
              private dssSessionService: SessionMementoService,
              private title: Title,
              private jwtHelper: JwtHelperService,
              private dashboardStoreService: DashboardStoreService) {}

  ngOnInit(): void {
    const LOCALE = 'en';

    // Title
    this.title.setTitle('Fon');

    // Store
    this.participantsStoreService.setStudy = MainConstants.study;
    this.dashboardStoreService.setStudy = MainConstants.study;
    this.participantsStoreService.dispatchGetSettings(MainConstants.participantsList);

    // Translation
    this.translateService.setDefaultLang(LOCALE);
    this.translateService.use(LOCALE);

    // Token
    const DSMToken = this.sessionService.getDSMToken();
    const userGuid = this.jwtHelper.decodeToken(DSMToken)['https://datadonationplatform.org/cid'];
    this.sessionService.setExpirationTime(DSMToken);
    this.dssSessionService.setSession(null, DSMToken, userGuid, LOCALE, +this.sessionService.getTokenExpiration());
  }

  toggleAsideNav(): void {
    this.asideNavVisible = !this.asideNavVisible;
  }
}
