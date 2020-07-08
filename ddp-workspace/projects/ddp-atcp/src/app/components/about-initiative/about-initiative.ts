import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

interface StepI {
  Name: string;
  Text: string;
  Steps?: {
    Name: string;
    Text: string;
  }[];
}

@Component({
  selector: 'app-about-initiative',
  templateUrl: './about-initiative.html',
  styleUrls: ['./about-initiative.scss']
})
export class AboutInitiativeComponent implements OnInit, OnDestroy {
  public steps: StepI[];
  private anchor = new CompositeDisposable();
  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translateSub$ = this.ngxTranslate.getTranslation(['AboutInitiative.ThirdParagraph.Steps'])
      .subscribe((steps: StepI[]) => this.steps = steps['AboutInitiative.ThirdParagraph.Steps']);
    this.anchor.addNew(translateSub$);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
