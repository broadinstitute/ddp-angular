import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-plotly-charts',
  templateUrl: 'plotly-charts.component.html',
  styleUrls: ['plotly-charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlotlyChartsComponent {
    @Input() chartData: any;
    @Input() config: any;

}
