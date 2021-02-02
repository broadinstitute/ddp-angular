import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us.component';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadModule } from '../../../../../ddp-sdk/src/lib/directives/lazy-load/lazy-load.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: AboutUsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    LazyLoadModule
  ],
  declarations: [AboutUsComponent]
})
export class AboutUsModule {}
