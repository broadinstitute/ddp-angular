import {Injectable} from '@angular/core';
import {dashboardType} from '../enums/dashboard.enums';
import {DSMService} from './dsm.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IDateRange} from '../dashboard-statistics/interfaces/IDateRange';
import {Plotly} from 'angular-plotly.js/lib/plotly.interface';
import {StatisticsEnum} from '../dashboard-statistics/enums/statistics.enum';
import {IChart} from '../dashboard-statistics/interfaces/IChart';
import {ICount} from '../dashboard-statistics/interfaces/ICount';


/**
 * @TODO Refactor this service and write unit tests
 */

interface chartFactory {
  type: string;
  func: (chartConfig: {}) => Plotly.Data;
}

@Injectable()
export class DashboardStatisticsService {

  constructor(private dsmService: DSMService) {}

  public getStatisticsFor(chartsOrCounts: StatisticsEnum, dateRange: IDateRange): Observable<any> {
    return ({
      COUNT: this.countsFactory(dateRange),
      CHART: this.chartFactory(dateRange)
    })[chartsOrCounts];
  }

  private chartFactory(dateRange: IDateRange): Observable<Plotly.Data> {
    return this.dsmService.getDashboardData(dateRange, StatisticsEnum.CHART)
      .pipe(
        map(data => {
          const generatedCharts: Plotly.Data = [];
          data.forEach(chart => {
            const generatedChart: Plotly.Data =
              this.CHART_TYPES.find((chartFactory: chartFactory) => chartFactory.type === chart.type)?.func(chart);
            generatedChart && generatedCharts.push(generatedChart);
          });
          return generatedCharts;
        })
      );
  }

  private countsFactory(dateRange: IDateRange): Observable<ICount[]> {
    return this.dsmService.getDashboardData(dateRange, StatisticsEnum.COUNT);
  }


  private readonly CHART_TYPES: chartFactory[]  = [
    {type: dashboardType.VERTICAL_HIGHLIGHTED_BAR_CHART, func: this.generate_verticalHighlightedBarChart},
    {type: dashboardType.VERTICAL_BAR_CHART, func: this.generate_verticalBarChart},
    {type: dashboardType.HORIZONTAL_BAR_CHART, func: this.generate_horizontalBarChart},
    {type: dashboardType.DONUT_CHART, func: this.generate_donutChart}
  ];

  private generate_verticalBarChart(chart: IChart): Plotly.Data {
    const chartObject: Plotly.Data = {};
    chartObject.data = [
      {
        type: 'bar',
        y: chart.y,
        x: chart.x,
        marker: {
          color: '#749DC5',
        },
        outsidetextfont: {
          color: '#2D333E',
          family: 'Montserrat-Bold',
          size: 13
        },
        text: chart.y,
        textposition: 'outside',
      },
    ];
    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: '#2D333E',
          family: 'Montserrat-SemiBold',
          size: 20
        },
        text: chart.title,
        x: 2
      },
      height: 600,

      hovermode: true,

      yaxis: {
        rangemode: 'tozero'
      },
      xaxis: {
        automargin: 'height+width+left'
      }
    };

    chartObject.size = chart.size;
    chartObject.type = chart.type;

    return chartObject;
  }

  private generate_verticalHighlightedBarChart(chart: any): Plotly.Data {
    const chartObject: Plotly.Data = {};
    chartObject.data = [
      {
        type: 'bar',
        name: 'Your center',
        y: [chart.y[0]],
        width: -1,
        marker: {
          color: '#749DC5',
        },
        outsidetextfont: {
          color: '#2D333E',
          family: 'Montserrat-Bold',
          size: 13
        },
        text: [chart.y[0]],
        textposition: 'outside',
        offset: 0.1,
      },
      {
        type: 'bar',
        name: 'Other centers (deidentified)',
        y: chart.y.slice(1),
        marker: {
          color: '#CFD6DC',
        },
        textposition: 'outside',
        text: chart.y.slice(1),
        offset: 2,
        base: 0,
        outsidetextfont: {
          color: '#2D333E',
          family: 'Montserrat-Bold',
          size: 13
        },
      }
    ];
    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: '#2D333E',
          family: 'Montserrat-SemiBold',
          size: 20
        },
        text: chart.title,
        x: 0
      },
      height: 600,

      hovermode: true,
      bargap: 0.3,
      showlegend: true,
      barmode: 'group',

      legend: {
        y: -0.01,
        xanchor: 'auto',
        itemwidth: 100,
        grouptitlefont: {
          family: 'Montserrat-Medium',
          size: 13,
          color: '#2D333E'
        },
        orientation: 'h',
        traceorder: 'grouped',
        font: {
          family: 'Montserrat-Medium',
        },
        itemclick: false,
        itemdoubleclick: false,
      },

      margin: {
        pad: 5,
      },

      xaxis: {
        tickangle: 0,
        ticklabelposition: 'outside bottom',
        ticklabelstep: 1,
        showticklabels: false,
        position: 0,
        linecolor: '#737E8E',
        linewidth: 1,
      },
      yaxis: {
        zeroline: false,
        fixedrange: true,
        dtick: 100,
        tickfont: {
          family: 'Montserrat-Regular',
          size: 13,
          color: '#2D333E'
        }
      }
    };

    chartObject.size = chart.size;
    chartObject.type = chart.type;

    return chartObject;
  }


  private generate_horizontalBarChart(chart: IChart): Plotly.Data {
    const chartObject: Plotly.Data = {};
    chartObject.data = [
      {
        type: 'bar',
        y: chart.y,
        x: chart.x,
        yaxis: 'y2',
        text: chart.x,
        marker: {
          color: '#749DC5',
        },
        outsidetextfont: {
          color: '#2D333E',
          family: 'Montserrat-Bold',
          size: 13
        },
        textposition: 'outside',
        barmode: 'stack',
        orientation: 'h',
        height: 800,
      }
    ];

    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: '#2D333E',
          family: 'Montserrat-SemiBold',
          size: 20
        },
        text: chart.title,
        x: 0,
        y: 0.86
      },

      hovermode: true,
      bargap: 0.3,
      showlegend: false,


      xaxis: {
        showticklabels: false,
        zeroline: false,
        position: 0,
        automargin: true,
        domain: [0.4, 0.9],
        tickfont: {
          family: 'Montserrat-Regular',
          size: 13,
          color: '#2D333E'
        }
      },

      yaxis2: {
        anchor: 'free',
        position: 0,
        side: 'right'
      },

      margin: {
        l: 0
      }
    };
    chartObject.size = chart.size;
    chartObject.type = chart.type;

    return chartObject;
  }


  private generate_donutChart(chart: IChart): Plotly.Data {
    const chartObject: Plotly.Data = {};
    chartObject.data = [
      {
        type: 'pie',
        values: chart.values,
        labels: chart.labels,
        hole: 0.55,
        marker: {
          color: chart.color,
        },
        outsidetextfont: {
          color: '#2D333E',
          family: 'Montserrat-Bold',
          size: 13
        },

        textposition: 'inside',
      }
    ];

    chartObject.layout = {
      width: 'auto',
      autosize: true,
      title: {
        font: {
          color: '#2D333E',
          family: 'Montserrat-SemiBold',
          size: 20
        },
        text: chart.title,
        x: 2,
      },


      height: 'auto',
      hovermode: true,
      showlegend: true,

      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
      },


      legend: {
        bgcolor: 'transparent',
        orientation: 'v',
        font: {
          family: 'Montserrat-Medium',
        },
        itemclick: false,
        itemdoubleclick: false,
      }
    };

    chartObject.size = chart.size;
    chartObject.type = chart.type;

    return chartObject;
  }


}
