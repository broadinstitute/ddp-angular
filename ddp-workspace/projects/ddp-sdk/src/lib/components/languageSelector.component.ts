import { Component, Input, OnInit } from "@angular/core";
import { StudyLanguage } from "../models/studyLanguage";
import { LanguageServiceAgent } from "../services/serviceAgents/languageServiceAgent.service";
import { isNullOrUndefined } from "util";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'ddp-language-selector',
  template: `
    <div [hidden]="!loaded">
      <button class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" *ngIf="currentLanguage !== null && currentLanguage !== undefined" [matMenuTriggerFor]="menu">
        <svg class="ddp-globe" height="24px" width="24px" aria-live="title">
          <title id="title" [lang]="currentLanguage.languageCode" translate>Toolkit.Header.LanguageSelection</title>
          <use href="assets/images/globe.svg#Language-Selector-3"></use>
        </svg>
        <span class="ddp-current-language">{{currentLanguage.displayName}}</span>
        <mat-icon class="ddp-dropdown-arrow">arrow_drop_down</mat-icon>
      </button>
      
      <mat-menu #menu="matMenu">
        <button mat-menu-item *ngFor="let lang of getUnselectedLanguages()" (click)="changeLanguage(lang)">{{lang.displayName}}</button>
      </mat-menu>
    </div>
  `
})
export class LanguageSelectorComponent implements OnInit {
  @Input() studyGuid: string;
  @Input() isScrolled: boolean;
  public loaded: boolean;
  private studyLanguages: Array<StudyLanguage>;
  private currentLanguage: StudyLanguage;

  constructor (
    private serviceAgent: LanguageServiceAgent,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.serviceAgent.getConfiguredLanguages(this.studyGuid).subscribe(x => {
      if (x) {
        console.log('got configured languages: ' + JSON.stringify(x));
        //Only use language selector if multiple languages are configured!
        if (x.length > 1) {
          this.studyLanguages = x;
          this.translateService.addLangs(this.studyLanguages.map(x => x.languageCode));
          if (this.findCurrentLanguage()) {
            this.loaded = true;
          }
        }
      } else {
        console.error('Error: no configured language list was returned.');
      }
    });
  }

  private getUnselectedLanguages(): Array<StudyLanguage> {
    if (this.studyLanguages !== null  && this.studyLanguages !== undefined) {
      return this.studyLanguages.filter(elem => elem !== this.currentLanguage);
    }
   return null;
  }

  private changeLanguage(lang: StudyLanguage): void {
    this.currentLanguage = lang;
    this.translateService.use(lang.languageCode);
    sessionStorage.setItem('studyLanguage', lang.languageCode);
  }

  //Find the current language and return true if successful or false otherwise
  public findCurrentLanguage(): boolean {
    //Check if we already have a current language
    if (!isNullOrUndefined(this.currentLanguage)) {
      if (null === sessionStorage.getItem('studyLanguage')) {
        //If we already have the current language and it isn't in session storage, put it there
        sessionStorage.setItem('studyLanguage', this.currentLanguage.languageCode);
      }
      this.translateService.use(this.currentLanguage.languageCode);
      return true;
    }

    //Check session storage
    let sessionCode: string = sessionStorage.getItem('studyLanguage');
    if (!isNullOrUndefined(sessionCode)){
      let sessionLang: StudyLanguage = this.studyLanguages.find(x => x.languageCode === sessionCode);
      if (!isNullOrUndefined(sessionLang)) {
        this.changeLanguage(sessionLang);
        return true;
      }
    }

    //TODO: Check user profile for configured language--will happen in a later ticket

    //Check for a default language
    let lang: StudyLanguage = this.studyLanguages.find(element => element.isDefault = true);
    if (isNullOrUndefined(lang)) {
      console.error('Error: no default language found');
      return false;
    }
    this.changeLanguage(lang);
    return true;
  }
}
