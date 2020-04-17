import { Component, OnInit } from '@angular/core';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsComponent implements OnInit {
  public Statistics;

  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    this.ngxTranslate.getTranslation('Statistics')
      .subscribe((data: any) => this.Statistics = data);
  }
}
