import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

interface CountersI {
  [key: number]: {
    Number: string;
    Text: string;
  };
}

interface CountersWithEmojiI {
  [key: number]: {
    Width: string;
    Emoji: string;
    Name: string;
  };
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.html',
  styleUrls: ['./statistics.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  public countersFirst: CountersI = [];
  public countersSecond: CountersI = [];
  public countersThird: CountersWithEmojiI = [];
  private anchor = new CompositeDisposable();
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation([
      'Statistics.CountersFirst.List',
      'Statistics.CountersSecond',
      'Statistics.CountersThird.List'
    ])
      .subscribe((data: {
        'Statistics.CountersFirst.List': CountersI;
        'Statistics.CountersSecond': CountersI;
        'Statistics.CountersThird.List': CountersWithEmojiI;
      }) => {
        this.countersFirst = data['Statistics.CountersFirst.List'];
        this.countersSecond = data['Statistics.CountersSecond'];
        this.countersThird = data['Statistics.CountersThird.List'];
      });
    this.anchor.addNew(translate$);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
