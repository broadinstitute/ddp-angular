import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FonRoutingModule } from './fon-routing.module';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { ParticipantsListComponent } from './pages/participantsList/participantsList.component';
import { FonComponent } from './fon.component';
import { HomeComponent } from './pages/home/home.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './../../material.module';

@NgModule({
  declarations: [
    NavigationComponent,
    FonComponent,
    ParticipantsListComponent,
    HomeComponent,
    ActivitiesComponent,
  ],
  imports: [CommonModule, FonRoutingModule, MaterialModule, RouterModule],
})
export class FonModule {}
