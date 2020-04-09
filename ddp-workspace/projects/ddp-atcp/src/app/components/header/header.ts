import { Component, Inject, OnInit } from '@angular/core';
import { NGXTranslateService, SessionMementoService } from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  public RouterResource = RouterResource;
  public SignIn: string;

  constructor(@Inject(LanguagesToken) public languages: Language[],
              private session: SessionMementoService,
              private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    this.ngxTranslate.getTranslation('Common.Navigation.SignIn')
      .subscribe((SignIn: string) => this.SignIn = SignIn);
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public trackByFn(indx: number): number {
    return indx;
  }
}
