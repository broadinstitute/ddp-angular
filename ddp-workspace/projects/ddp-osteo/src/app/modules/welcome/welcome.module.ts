import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadModule } from '../../../../../ddp-sdk/src/lib/directives/lazy-load/lazy-load.module';
import { TwitterTimelineWidgetModule } from '../../../../../toolkit/src/lib/components/twitter-widget/twitter-timeline-widget.module';
import { InstagramFeedLightwidgetPluginModule } from '../../../../../toolkit/src/lib/components/instagram-feed-lightwidget-plugin/instagram-feed-lightwidget-plugin.module';
import { GalleryComponent } from '../../components/gallery/gallery.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    LazyLoadModule,
    TwitterTimelineWidgetModule,
    InstagramFeedLightwidgetPluginModule
  ],
  declarations: [
    WelcomeComponent,
    GalleryComponent
  ]
})
export class WelcomeModule {}
