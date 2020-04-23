import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as RouterResource from '../../router-resources';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  public list: string[] = [];
  private anchor = new CompositeDisposable();
  @ViewChild('together', {
    static: false
  }) together;

  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public scrollTo(): void {
    this.together.nativeElement.scrollIntoView();
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation('HomePage.Participate.Steps.Second.Ul')
      .subscribe((list: string[]) => this.list = list);
    this.anchor.addNew(translate$);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
