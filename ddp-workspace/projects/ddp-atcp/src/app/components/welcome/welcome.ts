import { Component, OnInit, ViewChild } from '@angular/core';
import * as RouterResource from '../../router-resources';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class WelcomeComponent implements OnInit {
  public RouterResource = RouterResource;
  public list: string[] = [];

  @ViewChild('together', {
    static: false
  }) together;

  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public scrollTo() {
    this.together.nativeElement.scrollIntoView();
  }

  public ngOnInit(): void {
    this.ngxTranslate.getTranslation('HomePage.Participate.Steps.Second.Ul')
      .subscribe((list: string[]) => this.list = list);
  }
}
