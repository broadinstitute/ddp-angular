import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FonComponent } from './pages/fon.component';

const routes: Routes = [
  {
    path: '',
    component: FonComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      {
        path: 'patients',
        loadChildren: () =>
          import('./../patients/patients.module').then((m) => m.PatientsModule),
      },
      // { path: 'patients', component: ParticipantsListComponent },
      // { path: 'participantList', component: ParticipantsListComponent },
      // {
      //   path: 'patient/:guid',
      //   component: ActivitiesComponent,
      //   children: [{ path: ':activity', component: ActivityComponent }],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class fonRoutingModule {}
