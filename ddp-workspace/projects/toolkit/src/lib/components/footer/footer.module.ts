import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LazyLoadModule } from '../../../../../ddp-sdk/src/lib/directives/lazy-load/lazy-load.module';

@NgModule({
  imports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    LazyLoadModule,
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
