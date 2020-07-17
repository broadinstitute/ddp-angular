import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as RouterResource from '../../router-resources';
import { CompositeDisposable, NGXTranslateService, SessionMementoService } from 'ddp-sdk';

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

  @ViewChild('join', {
    static: false
  }) join;

  @ViewChild('participate', {
    static: false
  }) participate;

  constructor(private ngxTranslate: NGXTranslateService,
              private session: SessionMementoService) {
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public scrollTo(element): void {
    element.scrollIntoView();
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation(['HomePage.Participate.Steps.Second.Ul'])
      .subscribe((list: string[]) => {
        this.list = list['HomePage.Participate.Steps.Second.Ul'];
      });
    this.anchor.addNew(translate$);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
