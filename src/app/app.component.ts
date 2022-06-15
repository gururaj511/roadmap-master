import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from "moment";
import HC_more from 'highcharts/highcharts-more';
import Xrange from 'highcharts/modules/xrange';
import NoData from 'highcharts/modules/no-data-to-display';
import Boost from 'highcharts/modules/boost';
import DraggablePoints from 'highcharts/modules/draggable-points';
import Highstock from 'highcharts/modules/stock';
import {Project} from "./data-model/project";
import {RoadmapService} from "./service/roadmap.service";
import {Subscription} from "rxjs";
import {InfoPopupComponent} from "./info-popup/info-popup.component";
import {MatDialog} from "@angular/material/dialog";

HC_more(Highcharts);
Boost(Highcharts);
Xrange(Highcharts);
NoData(Highcharts);
DraggablePoints(Highcharts);
Highstock(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  chartOptions: Highcharts.Options = {};
  allLabels = [];
  projects: Project[] = [];
  private subscription: Subscription[] = [];

  constructor(
    private roadmapService: RoadmapService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.subscription.push(this.roadmapService.getAllIssues().subscribe((res: any) => {
      if (res) {
        this.allLabels = this.roadmapService.getDistinctLabels(res);
        this.projects = this.roadmapService.getFormattedIssues(res);
        this.initialiseChart();
        if (document.getElementById('roadmap-chart')) {
          Highcharts.chart('roadmap-chart', this.chartOptions);
          this.cdRef.detectChanges();
        }
      }
    }))
  }

  getStartDate(project: Project): Date {
    let days = project.originalEstimatedSec / (60 * 60 * 8);//min*sec*8hr
    let startDate = moment(project.dueDate).add((-1 * days), 'day');
    return startDate.toDate();
  }

  constructChartSeries(): any[] {
    let seriesData: any[] = [];
    if (this.allLabels?.length) {
      this.projects.forEach(project => {
        if (project.labels?.length) {
          const labels: string[] = project.labels;
          this.allLabels.forEach((label, index) => {
            if (labels.includes(label)) {
              seriesData.push({
                showInLegend: false,
                pointWidth: 30,
                data: [{
                  x: this.getStartDate(project).getTime(),
                  x2: new Date(project.dueDate).getTime(),
                  y: index,
                  dataLabels: {
                    enabled: true,
                    style: {
                      textOutline: 0,
                      overflow: '',
                      fontWeight: 400
                    }
                  },
                  issueType: project.issueType,
                  issueKey: project.key,
                  description: project.description,
                  estimation: project.originalEstimatedDays,
                  id: project.id
                }]
              })
            }
          })
        }
      })
    }
    return seriesData;
  }

  showPopupComponent(point:any){
    let jiraPoint = {
      issueType: point.issueType,
      issueKey: point.issueKey,
      description: point.description,
      x: moment(point.x).format('DD MMM'),
      x2: moment(point.x2).format('DD MMM')
    }
      const dialogRef = this.dialog.open(InfoPopupComponent, {
        width: '250px',
        data: {jiraPoint},
        hasBackdrop: false
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  }

  initialiseChart() {
    // @ts-ignore
    this.chartOptions = {
      chart: {
        type: 'xrange',
        zoomType: 'xy'
      },
      title: {
        text: ''
      },
      tooltip:{
        enabled: false
      },
     /* tooltip: {
        headerFormat: '',

        pointFormatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const point: any = this;
          return `${point.issueType}: <b>${point.issueKey}</b><br>${moment(point.x).format('DD MMM')} - ${moment(point.x2).format('DD MMM')}<br>${point?.description ? point.description : ''}`;
        }
      },*/
      // @ts-ignore
      xAxis: {
        type: 'datetime',
        labels: {
          formatter: function () {
            return `<span>${moment(this.value).format('DD/MM/YY')}</span>`;
          }
        }
      },
      yAxis: {
        type: 'category',
        title: {
          text: ''
        },
        categories: [...this.allLabels],
        reversed: true
      },
      plotOptions: {
        xrange: {
          point:{
            events: {
              click: (event) => {
                this.dialog.closeAll();
                return this.showPopupComponent(event['point']);
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function () {
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const self: any = this;
              return `<span style="font-weight: normal">
                        ${self?.point?.issueKey}${self?.point?.estimation ? ('(' + self.point.estimation + ')') : ''}
                      </span>`;
            }
          },

        }
      },
      // @ts-ignore
      series: this.constructChartSeries()
    }
  }


  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

}

