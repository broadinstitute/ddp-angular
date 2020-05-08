import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

interface HospitalsI {
  [key: number]: {
    Name: string;
    Country: string;
  };
}

interface DoctorsI {
  [key: number]: {
    Name: string;
    Rank: string;
    Hospital: string;
  };
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  public hospitals: HospitalsI[] = [];
  public doctors: DoctorsI[] = [];
  private anchor = new CompositeDisposable();
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translateSub$ = this.ngxTranslate.getTranslation(['AboutPage.Hospitals', 'AboutPage.Doctors'])
      .subscribe((data: {
        'AboutPage.Hospitals': {
          Name: string;
          Country: string;
        }[];
        'AboutPage.Doctors': {
          Name: string;
          Rank: string;
          Hospital: string;
        }[];
      }) => {
        this.hospitals = data['AboutPage.Hospitals'];
        this.doctors = data['AboutPage.Doctors'];
      });
    this.anchor.addNew(translateSub$);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
