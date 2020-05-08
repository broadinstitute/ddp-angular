import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, NGXTranslateService, SessionMementoService } from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public RouterResource = RouterResource;
  public SignIn: string;
  private anchor = new CompositeDisposable();

  constructor(@Inject(LanguagesToken) public languages: Language[],
              private session: SessionMementoService,
              private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation('Common.Navigation.SignIn')
      .subscribe((SignIn: string) => this.SignIn = SignIn);
    this.anchor.addNew(translate$);
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public trackByFn(indx: number): number {
    return indx;
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
