import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NewDashboardComponent} from "./components/dashboard/dashboard.component";
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    NewDashboardComponent
  ],
  imports: [
    CommonModule,
    PlotlyModule
  ],
  providers: [],
  exports: [NewDashboardComponent]
})

export class SharedModule {}
