import { Component, Inject, OnInit } from '@angular/core';
import { ConfigurationService, LanguageService } from 'ddp-sdk';
import { LanguageServiceAgent } from "../../../../../ddp-sdk/src/lib/services/serviceAgents/languageServiceAgent.service"; //TODO: Export this...
import { ActivatedRoute, Router } from "@angular/router";
import { StudyLanguage } from "../../../../../ddp-sdk/src/lib/models/studyLanguage"; //TODO: Export this...
import { map, take } from "rxjs/operators";

@Component({
  selector: 'app-change-language-redirect',
  template: `
        <ng-container></ng-container>
    `
})
export class ChangeLanguageRedirectComponent implements OnInit {
  private dest: string = null;
  private lang: string = null;
  private supportedLangs: StudyLanguage[] = null;

  constructor(
    private languageService: LanguageService,
    private languageServiceAgent: LanguageServiceAgent,
    private route: ActivatedRoute,
    private router: Router,
    @Inject('ddp.config') private config: ConfigurationService) {
  }

  public ngOnInit(): void {
    //Get the specified language and specified destination and store for later
    let paramPromise: Promise<void> = this.getParamInfo();

    //Get the study's configured languages and store for later
    let supportedLanguagesPromise: Promise<void> = this.getSupportedLanguages();

    //Attempt to change language and redirect
    Promise.all([paramPromise, supportedLanguagesPromise])
      .then(() => {
        //Add the configured languages
        this.languageService.addLanguages(this.supportedLangs.map(x => x.languageCode));

        //Try to switch to the specified language
        if (!this.languageService.changeLanguage(this.lang)) {
          console.log('Could not change language to ${this.lang}.');
        }

        //Do the redirect
        this.router.navigate([this.dest], {relativeTo: this.route.root});
    })
  }

  private getParamInfo(): Promise<void> {
    return this.route.paramMap
      .pipe(take(1))
      .pipe(map(x => {
      this.lang = x.get('language');
      this.dest = x.get('destination');
    })).toPromise();
  }

  private getSupportedLanguages(): Promise<void> {
    return this.languageServiceAgent.getConfiguredLanguages(this.config.studyGuid)
      .pipe(take(1))
      .pipe(map(x => {
        this.supportedLangs = x;
    })).toPromise();
  }
}
