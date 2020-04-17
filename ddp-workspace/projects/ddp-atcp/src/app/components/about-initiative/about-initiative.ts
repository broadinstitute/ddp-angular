import { Component, OnInit } from '@angular/core';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-about-initiative',
  templateUrl: './about-initiative.html',
  styleUrls: ['./about-initiative.scss']
})
export class AboutInitiativeComponent implements OnInit {
  public AboutInitiative;
  public steps;

  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    this.ngxTranslate.getTranslation('AboutInitiative')
      .subscribe((data: any) => {
        this.AboutInitiative = data;
        this.steps = this.AboutInitiative.ThirdParagraph.Steps;
      });
  }
}
