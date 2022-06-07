import {APP_INITIALIZER, Injector, NgModule} from "@angular/core";
import {NavigationComponent} from "./layout/navigation/navigation.component";
import {FonComponent} from "./fon.component";
import {ActivityComponent} from "./pages/activities/activity/activity.component";
import {ParticipantsListComponent} from "./pages/participantsList/participantsList.component";
import {ActivitiesComponent} from "./pages/activities/activities.component";
import {HomeComponent} from "./pages/home/home.component";
import {fonRoutingModule} from "./fon-routing.module";
import {CommonModule, LOCATION_INITIALIZED} from "@angular/common";
import {createTranslateLoader, DdpModule, LanguageService, LoggingService, SessionMementoService} from 'ddp-sdk';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {AgentService} from "./services/agent.service";
import {
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService, TranslateStore
} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";


export function translateFactory(translate: TranslateService,
                                 injector: Injector,
                                 logger: LoggingService,
                                 // language: LanguageService // TODO: setup languages for DSM
): () => Promise<any> {
  return () => new Promise<any>((resolve: any) => {
    const LOG_SOURCE = 'DSM AppModule';
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const locale = 'en'; // language.getAppLanguageCode();
      translate.setDefaultLang(locale);
      translate.use(locale).subscribe({
        next: () => {
          logger.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
        },
        error: err => {
          logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
        },
        complete: () => {
          resolve(null);
        }
      });
    });
  });
}


const material = [
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule
];

@NgModule({
  declarations: [
    NavigationComponent,
    FonComponent,
    ActivityComponent,
    ParticipantsListComponent,
    ActivitiesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    fonRoutingModule,
    DdpModule.forDSM(),
    ...material,
  ],
  providers: [
    AgentService,
    TranslateStore,
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [
        TranslateService,
        Injector,
        LoggingService,
        LanguageService
      ],
      multi: true
    }
  ],
  exports: []
})

export class fonModule {}
