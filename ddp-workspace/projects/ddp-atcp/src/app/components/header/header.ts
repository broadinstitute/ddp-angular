import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {CompositeDisposable, ConfigurationService, NGXTranslateService, SessionMementoService} from 'ddp-sdk';
import * as RouterResource from '../../router-resources';
import { Language, LanguagesToken } from '../../providers/languages.provider';
import {TranslateService} from "@ngx-translate/core";
import {resolve} from "@angular/compiler-cli/src/ngtsc/file_system";

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
              private ngxTranslate: NGXTranslateService,
              private translate: TranslateService,
              @Inject('ddp.config') private configuration: ConfigurationService) {
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

  public changeLanguage(language: Language): void {
    this.translate.use(language.code).subscribe(() => {
      console.log(`Successfully initialized '${language.code}' language.`);
    }, err => {
      console.error(`Problem with '${language.code}' language initialization. Default '${this.configuration.defaultLanguageCode}' language is used`);
      this.translate.use(this.configuration.defaultLanguageCode);
    });
  }
}
