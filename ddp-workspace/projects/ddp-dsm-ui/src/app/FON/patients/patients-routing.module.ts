import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './../core/components/activities/activities.component';
import { ActivityComponent } from './../core/components/activities/activity/activity.component';
import { ParticipantsListComponent } from './components/participantsList/participantsList.component';
import { PatientsComponent } from './pages/patients.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
    children: [
      { path: '', redirectTo: 'participant-list' },
      {
        path: 'participant-list',
        component: ParticipantsListComponent,
      },
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
export class PatientsRoutingModule {}
