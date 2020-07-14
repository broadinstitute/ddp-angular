import { Component, Inject, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { StudyLanguage } from '../models/studyLanguage';
import { ConfigurationService } from '../services/configuration.service';
import { LanguageService } from '../services/languageService.service';
import { LanguageServiceAgent } from '../services/serviceAgents/languageServiceAgent.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ddp-language-selector',
  template: `
    <div [hidden]="!loaded">
      <button *ngIf="!!currentLanguage" class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" [matMenuTriggerFor]="menu">
        <svg class="ddp-globe" height="24px" width="24px">
          <title id="title" [lang]="currentLanguage.languageCode" translate>SDK.LanguageSelector.LanguageSelection</title>
          <use [attr.href]="iconURL"></use>
        </svg>
        <span class="ddp-current-language">{{currentLanguage.displayName}}</span>
        <mat-icon class="ddp-dropdown-arrow">arrow_drop_down</mat-icon>
      </button>
      
      <mat-menu #menu="matMenu" class="language-menu">
        <button mat-menu-item *ngFor="let lang of getUnselectedLanguages()" (click)="changeLanguage(lang)">{{lang.displayName}}</button>
      </mat-menu>
    </div>
  `
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  @Input() isScrolled: boolean;
  @Output() isVisible: EventEmitter<boolean> = new EventEmitter();
  public loaded: boolean;
  public currentLanguage: StudyLanguage;
  public iconURL: string;
  private studyLanguages: StudyLanguage[] = [];
  private anchor: Subscription;

  constructor(
    private serviceAgent: LanguageServiceAgent,
    private language: LanguageService,
    @Inject('ddp.config') private config: ConfigurationService) { }

  public ngOnInit(): void {
    this.iconURL = this.config.languageSelectorIconURL ? this.config.languageSelectorIconURL : "assets/images/globe.svg#Language-Selector-3";
    this.anchor = this.serviceAgent.getConfiguredLanguages(this.config.studyGuid).subscribe(x => {
      if (x) {
        //Only use language selector if multiple languages are configured!
        if (x.length > 1) {
          this.studyLanguages = x;
          this.language.addLanguages(this.studyLanguages.map(x => x.languageCode));
          if (this.findCurrentLanguage()) {
            this.loaded = true;
            this.isVisible.emit(true);
          }
        } else {
          this.isVisible.emit(false);
        }
      } else {
        console.error('Error: no configured language list was returned.');
        this.isVisible.emit(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public getUnselectedLanguages(): Array<StudyLanguage> {
    return this.studyLanguages.filter(language => language.languageCode !== this.currentLanguage.languageCode);
  }

  public changeLanguage(lang: StudyLanguage): void {
    if (this.language.canUseLanguage(lang.languageCode)) {
      this.currentLanguage = lang;
      this.language.changeLanguage(lang.languageCode);
    }
    else {
      console.error('Error: The specified language: ' + JSON.stringify(lang) + ' is not configured for the study.');
    }
  }

  //Find the current language and return true if successful or false otherwise
  public findCurrentLanguage(): boolean {
    //Check if we already have a current language
    if (!!this.currentLanguage) {
      this.changeLanguage(this.currentLanguage);
      return true;
    }

    //Check storage
    let loadedCode: string = this.language.useStoredLanguage();
    if (loadedCode) {
      let loadedLang: StudyLanguage = this.studyLanguages.find(x => x.languageCode === loadedCode);
      if (!!loadedLang) {
        this.currentLanguage = loadedLang;
        return true;
      }
    }

    //TODO: Check user profile for configured language--will happen in a later ticket

    //Check for a default language
    let lang: StudyLanguage = this.studyLanguages.find(element => element.isDefault = true);
    if (!!lang) {
      this.changeLanguage(lang);
      return true;
    }

    console.error('Error: no default language found');
    return false;
  }
}
