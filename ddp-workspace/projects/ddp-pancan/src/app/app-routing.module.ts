import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IrbGuard } from 'ddp-sdk';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
    canActivate: [IrbGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
