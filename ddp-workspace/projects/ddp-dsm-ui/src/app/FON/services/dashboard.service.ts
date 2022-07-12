import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {map, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {dashboardSize, dashboardType} from "../pages/home/dashboard/enums/dashboard.enums";

@Injectable()

export class DashboardService {
  chartTypes;

  private sizes(sizeName: string): number {
    switch (sizeName) {
      case dashboardSize.SMALL:
        return 433
      case dashboardSize.MEDIUM:
        return 543
      case dashboardSize.LARGE:
        return 1000
      default:
        return 1000;
    }
  }

  constructor(private httpService: HttpService) {
    this.chartTypes = [
      {type: dashboardType.VERTICAL_BAR_CHART, func: this.generate_verticalBarChart},
      {type: dashboardType.HORIZONTAL_BAR_CHART, func: this.generate_horizontalBarChart},
      {type: dashboardType.DONUT, func: this.generate_donutChart}
    ]
  }

  public get charts(): Observable<any> {
    return this.fetchCharts.pipe(map(data => this.buildChart(data)), tap(console.log))
  }

  private get fetchCharts(): Observable<any> {
    return this.httpService.getDashboardData;
  }

  private buildChart = (data: any) => {
    const generatedCharts = [];
    data.forEach(chart => {
      const generatedChart = this.chartTypes.find(ch => ch.type === chart.type)?.func(chart);
      generatedCharts.push(generatedChart);
    })
    console.log(generatedCharts, 'generated charts')
    return generatedCharts;
  }



  private generate_verticalBarChart = (chart: any) => {
    const chartObject: any = {};
    chartObject.data = [
      {
        type: "bar",
        name: 'Your center',
        legendgroup: "yours",
        y: [chart.y[0]],
        width: -1,
        marker: {
          color: "#749DC5",
        },
        outsidetextfont: {
          color: '#2D333E',
          family: "Montserrat-Bold",
          size: 13
        },
        text: [chart.y[0]],
        textposition: "outside",
        offset: 0.1,
      },
      {
        type: "bar",
        name: 'Other centers (deidentified)',
        legendgroup: "others",
        y: chart.y.slice(1),
        marker: {
          color: "#CFD6DC",
        },
        textposition: "outside",
        text: chart.y.slice(1),
        offset: 2,
        base: 0,
        outsidetextfont: {
          color: '#2D333E',
          family: "Montserrat-Bold",
          size: 13
        },
      }
    ];
    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: "#2D333E",
          family: "Montserrat-SemiBold",
          size: 20
        },
        text: chart.title,
        x: 0
      },
      height: 500,

      hovermode: false,
      bargap: 0.3,
      showlegend: true,
      barmode: "group",

      legend: {
        y: -0.01,
        xanchor: "auto",
        itemwidth: 100,
        grouptitlefont: {
          family: "Montserrat-Medium",
          size: 13,
          color: '#2D333E'
        },
        orientation: "h",
        traceorder: "grouped",
        font: {
          family: "Montserrat-Medium",
        },
        itemclick: false,
        itemdoubleclick: false,
      },

      margin: {
        pad:5,
      },

      xaxis: {
        tickangle: 0,
        ticklabelposition: "outside bottom",
        ticklabelstep: 1,
        showticklabels: false,
        position: 0,
        linecolor: "#737E8E",
        linewidth: 1,
        categoryarray: ['ggaga', 'dasda']
      },
      yaxis: {
        zeroline: false,
        fixedrange: true,
        dtick: 100,
        tickfont: {
          family: "Montserrat-Regular",
          size: 13,
          color: '#2D333E'
        }
      }
    }

    chartObject.size = chart.size

    return chartObject;
  }






  private generate_horizontalBarChart = (chart: any) => {
    const chartObject: any = {};
    chartObject.data = [
      {
        type: "bar",
        y: chart.y,
        x: chart.x,
        yaxis: "y2",
        text: chart.x,
        marker: {
          color: "#749DC5",
        },
        outsidetextfont: {
          color: '#2D333E',
          family: "Montserrat-Bold",
          size: 13
        },
        textposition: "outside",
        barmode: 'stack',
        orientation: 'h'
      }
    ];

    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: "#2D333E",
          family: "Montserrat-SemiBold",
          size: 20
        },
        text: chart.title,
        x: 0,
        y: 0.86
      },

      height: 500,
      hovermode: false,
      bargap: 0.3,
      showlegend: false,


      xaxis: {
        showticklabels: false,
        zeroline: false,
        position: 0,
        automargin: true,
        domain: [0.32, 0.9],
        tickfont: {
          family: "Montserrat-Regular",
          size: 13,
          color: '#2D333E'
        }
      },

      yaxis2: {
        anchor: "free",
        position: 0,
        side: "right"
      },

      margin: {
        l: 0
      }
    }
    chartObject.size = chart.size

    return chartObject;
  }



  private generate_donutChart = (chart: any) => {
    const chartObject: any = {};
    chartObject.data = [
      {
        type: "pie",
        values: chart.values,
        labels: chart.labels,
        hole: 0.55,
        marker: {
          color: "#749DC5",
        },
        outsidetextfont: {
          color: '#2D333E',
          family: "Montserrat-Bold",
          size: 13
        },

        textposition: "outside",
      }
    ];

    chartObject.layout = {
      autosize: true,
      title: {
        font: {
          color: "#2D333E",
          family: "Montserrat-SemiBold",
          size: 20
        },
        text: chart.title,
        x: 0,
        y: 0.86
      },



      height: 500,
      hovermode: false,
      showlegend: true,

      margin: {
        l: 0
      },


      legend: {
        x: 0,
        valign: "bottom",
        font: {
          family: "Montserrat-Medium",
        },
        itemclick: false,
        itemdoubleclick: false,
      },
    }

    chartObject.size = chart.size

    return chartObject;
  }
}
