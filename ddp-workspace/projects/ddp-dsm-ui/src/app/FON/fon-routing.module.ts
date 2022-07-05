import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {PatientsListComponent} from './pages/patients-list/patients-list.component';
import {ActivitiesComponent} from './pages/activities/activities.component';
import {ActivityComponent} from './pages/activities/components/activity/activity.component';
import {FonComponent} from './fon.component';

const routes: Routes = [
  {
    path: '', component: FonComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'patients', component: PatientsListComponent},
      {path: 'patients/:guid', component: ActivitiesComponent, children: [
          {path: ':activity', component: ActivityComponent}
        ]
      },
      {path: 'participantList', component: PatientsListComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class fonRoutingModule {
}
