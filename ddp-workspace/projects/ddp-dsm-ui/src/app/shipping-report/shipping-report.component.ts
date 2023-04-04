import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils/utils';
import { Auth } from '../services/auth.service';
import { DSMService } from '../services/dsm.service';
import { ShippingReport } from './shipping-report.model';
import { Result } from '../utils/result.model';
import { Statics } from '../utils/statics';

@Component({
  selector: 'app-shipping-report',
  templateUrl: './shipping-report.component.html',
  styleUrls: ['./shipping-report.component.css']
})
export class ShippingReportComponent implements OnInit {
  errorMessage: string;
  loadingReport = false;
  startDate: string;
  endDate: string;
  reportData: any[];

  constructor(private dsmService: DSMService, private auth: Auth) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
  }

  ngOnInit(): void {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    this.startDate = Utils.getFormattedDate(start);
    const end = new Date();
    this.endDate = Utils.getFormattedDate(end);
    this.reload();
  }

  private loadReport(startDate: string, endDate: string): void {
    this.loadingReport = true;
    let jsonData: any[];
    this.dsmService.getShippingReport(startDate, endDate).subscribe({
      next: data => {
        this.reportData = [];
        const result = Result.parse(data);
        if (result.code != null && result.code !== 200) {
          this.errorMessage = 'Error - Loading Sample Report\nPlease contact your DSM developer';
        } else {
          jsonData = data;
          jsonData.forEach((val) => {
            const kitType = ShippingReport.parse(val);
            this.reportData.push(kitType);
          });
        }
        this.loadingReport = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.sessionLogout();
        }
        this.loadingReport = false;
        this.errorMessage = 'Error - Loading Sample Report\nPlease contact your DSM developer';
      }
    });
  }

  public reload(): void {
    this.loadReport(this.startDate, this.endDate);
  }

  startChanged(date: string): void {
    this.startDate = date;
  }

  endChanged(date: string): void {
    this.endDate = date;
  }

  downloadReport(): void {
    let jsonData: any[];
    const downloadData: any[] = [];
    this.dsmService.getShippingReportOverview().subscribe({
      next: data => {
        // console.info(`received: ${JSON.stringify(data, null, 2)}`);
        const result = Result.parse(data);
        if (result.code != null && result.code !== 200) {
          this.errorMessage = 'Error - Downloading Sample Report\nPlease contact your DSM developer';
        } else {
          jsonData = data;
          jsonData.forEach((val) => {
            const kitType = ShippingReport.parse(val);
            downloadData.push(kitType);
          });
          this.saveReport(downloadData);
        }
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.sessionLogout();
        }
        this.loadingReport = false;
        this.errorMessage = 'Error - Loading Sample Report\nPlease contact your DSM developer';
      }
    });
  }

  saveReport(downloadData: any[]): void {
    const map: { kitType: string; month: string; ddpName: string; sent: number; received: number }[] = [];
    if (downloadData != null) {
      for (const dataItem of downloadData) {
        if (dataItem.summaryKitTypeList != null) {
          for (const item of dataItem.summaryKitTypeList) {
            map.push({
              kitType: item.kitType,
              month: item.month,
              ddpName: dataItem.ddpName,
              sent: item.sent,
              received: item.received
            });
          }
        }
      }
      if (map.length > 0) {
        const fields = [{ label: 'Material Type', value: 'kitType' },
          { label: 'Month', value: 'month' },
          { label: 'Project', value: 'ddpName' },
          { label: 'Number of Samples Shipped', value: 'sent' },
          { label: 'Number of Samples Received', value: 'received' }];
        const date = new Date();
        Utils.createCSV(fields, map, 'GP_Report_' + Utils.getDateFormatted(date, Utils.DATE_STRING_CVS) + Statics.CSV_FILE_EXTENSION);
      }
    }
  }
}
