import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Plotly} from "angular-plotly.js/lib/plotly.interface";

@Component({
  selector: 'app-plotly-charts',
  templateUrl: 'plotly-charts.component.html',
  styleUrls: ['plotly-charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlotlyChartsComponent {
  @Input() chartData: Plotly.Data;

  get configuration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }

}
