import { NgModule } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FonComponent } from './pages/fon.component';
import { ActivityComponent } from '../pages/activities/activity/activity.component';
import { ParticipantsListComponent } from '../pages/participantsList/participantsList.component';
import { ActivitiesComponent } from '../pages/activities/activities.component';
import { HomeComponent } from './components/home/home.component';
import { fonRoutingModule } from './fon-routing.module';
import { CommonModule } from '@angular/common';
import { DdpModule, SessionMementoService } from 'ddp-sdk';
import { StoreService } from '../../STORE/store.service';
import { MainConstants } from '../constants/main-constants';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../services/session.service';
import { Title } from '@angular/platform-browser';
import { MaterialModule } from './../../../../src/material.module';

@NgModule({
  declarations: [
    NavigationComponent,
    FonComponent,
    ActivityComponent,
    ParticipantsListComponent,
    ActivitiesComponent,
    HomeComponent,
  ],
  imports: [CommonModule, fonRoutingModule, DdpModule.forDSM(), MaterialModule],
  providers: [],
  exports: [],
})
export class fonModule {
  constructor(
    private storeService: StoreService,
    private translateService: TranslateService,
    private sessionService: SessionService,
    private dssSessionService: SessionMementoService,
    private title: Title
  ) {
    const LOCALE = 'en';

    // Title
    this.title.setTitle('Fon');

    // Token
    const DSMToken = this.sessionService.getDSMToken();
    this.sessionService.setExpirationTime(DSMToken);
    this.dssSessionService.setSession(
      null,
      DSMToken,
      null,
      LOCALE,
      +this.sessionService.getTokenExpiration()
    );

    // Store
    this.storeService.setStudy = MainConstants.study;
    this.storeService.dispatchGetSettings(MainConstants.participantsListParent);

    // Translation
    this.translateService.setDefaultLang(LOCALE);
    this.translateService.use(LOCALE);
  }
}
