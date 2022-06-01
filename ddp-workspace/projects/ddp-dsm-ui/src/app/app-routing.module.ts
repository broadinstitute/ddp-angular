import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudyGuard} from './guards/study.guard';
import {CheckAuthGuard} from './guards/checkAuth.guard';
import {ParticipantsListComponent} from './FON/pages/participantsList/participantsList.component';
import {ActivitiesComponent} from './FON/pages/activities/activities.component';
import {FonComponent} from './FON/fon.component';
import {ActivityComponent} from './FON/pages/activities/activity/activity.component';
import {StudyActGuard} from './guards/studyAct.guard';
import { HomeComponent } from './FON/pages/home/home.component';

export const AppRoutes: Routes = [
  {path: '', loadChildren: () => import('./WELCOME/welcome.module').then(m => m.WelcomeModule),
    canLoad: [CheckAuthGuard], pathMatch: 'full'},

  {path: 'fon', component: FonComponent, canActivate: [StudyActGuard], children: [
      {path: '', component: HomeComponent},
      {path: 'patients', component: ParticipantsListComponent},
      {path: 'participantList', component: ParticipantsListComponent},
      {path: 'patient/:guid', component: ActivitiesComponent, children: [
          {path: ':activity', component: ActivityComponent}
        ]}
    ]
  },

  {path: ':study', loadChildren: () => import('./ALL-STUDIES/all-studies.module').then(m => m.AllStudiesModule),
    canLoad: [StudyGuard]},

  {path: '**', redirectTo: ''} //@TODO: Delete after 'not found' page component is made
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
