import {NgModule} from "@angular/core";
import {StoreModule} from "@ngrx/store";
import {StoreReducers} from "./store.reducers";
import {EffectsModule} from "@ngrx/effects";
import {ParticipantsEffects, SettingsEffects} from "./Participants/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../../environments/environment";
import {DashboardEffects} from "./Dashboard/effects";

@NgModule({
  imports: [
    StoreModule.forRoot(StoreReducers),
    EffectsModule.forRoot([ParticipantsEffects, SettingsEffects, DashboardEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ]
})

export class AppStoreModule {
}
