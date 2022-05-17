import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {PickStudyComponent} from './pickStudy/pickStudy.component';

const authRoutes: Routes = [
  {path: '', component: AuthComponent},
  {path: 'pickStudy', component: PickStudyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})

export class welcomeRoutingModule {}
