import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-plotly-charts',
  templateUrl: 'plotly-charts.component.html',
  styleUrls: ['plotly-charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlotlyChartsComponent {
  @Input() chartData: any;

  get configuration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }

}
