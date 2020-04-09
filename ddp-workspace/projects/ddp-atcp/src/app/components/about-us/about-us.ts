import { Component, OnInit } from '@angular/core';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.scss']
})
export class AboutUsComponent implements OnInit {
  public hospitals = [];
  public doctors = [];
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    this.ngxTranslate.getTranslation(['AboutPage.Hospitals', 'AboutPage.Doctors'])
      .subscribe((data: any) => {
        this.hospitals = data['AboutPage.Hospitals'];
        this.doctors = data['AboutPage.Doctors'];
      });
  }
}
