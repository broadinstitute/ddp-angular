import {NgModule} from '@angular/core';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {FonComponent} from './fon.component';
import {ActivityComponent} from './pages/activities/activity/activity.component';
import {ParticipantsListComponent} from './pages/participantsList/participantsList.component';
import {ActivitiesComponent} from './pages/activities/activities.component';
import {HomeComponent} from './pages/home/home.component';
import {fonRoutingModule} from './fon-routing.module';
import {CommonModule} from '@angular/common';
import {DdpModule} from 'ddp-sdk';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {StoreService} from '../STORE/store.service';
import {MainConstants} from './constants/main-constants';
import {TranslateService} from '@ngx-translate/core';


const material = [
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule
];

@NgModule({
  declarations: [
    NavigationComponent,
    FonComponent,
    ActivityComponent,
    ParticipantsListComponent,
    ActivitiesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    fonRoutingModule,
    DdpModule.forDSM(),
    ...material,
  ],
  providers: [],
  exports: []
})

export class fonModule {
  constructor(private storeService: StoreService,  private translateService: TranslateService) {

    // Store
    this.storeService.setStudy = MainConstants.study;
    this.storeService.dispatchGetSettings(MainConstants.participantsListParent);

    // Translation
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
