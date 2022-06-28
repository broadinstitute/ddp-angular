import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudyGuard} from './guards/study.guard';
import {CheckAuthGuard} from './guards/checkAuth.guard';

export const AppRoutes: Routes = [
  {path: '', loadChildren: () => import('./WELCOME/welcome.module').then(m => m.WelcomeModule),
    canLoad: [CheckAuthGuard], pathMatch: 'full'},

  {path: 'fon', loadChildren: () => import('./FON/fon.module').then(m => m.fonModule),
    canLoad: [StudyGuard]},

  {path: ':study', loadChildren: () => import('./ALL-STUDIES/all-studies.module').then(m => m.AllStudiesModule),
    canLoad: [StudyGuard]},

  {path: '**', redirectTo: ''} //@TODO: Delete after 'not found' page component is made
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
