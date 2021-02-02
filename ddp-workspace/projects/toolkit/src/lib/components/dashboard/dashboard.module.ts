import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { DdpDashboardModule } from '../../../../../ddp-sdk/src/lib/components/dashboard/dashboard.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    HeaderModule,
    MatIconModule,
    MatButtonModule,
    DdpDashboardModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {}
