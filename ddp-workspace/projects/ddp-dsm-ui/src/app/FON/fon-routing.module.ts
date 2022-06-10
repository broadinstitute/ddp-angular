import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantsListComponent } from './pages/participantsList/participantsList.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { FonComponent } from './fon.component';
import { ActivityComponent } from './pages/activities/activity/activity.component';

import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: FonComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'patients', component: ParticipantsListComponent },
      { path: 'participantList', component: ParticipantsListComponent },
      {
        path: 'patient/:guid',
        component: ActivitiesComponent,
        children: [{ path: ':activity', component: ActivityComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FonRoutingModule {}
