import { Component, Input, OnInit } from "@angular/core";
import { StudyLanguage } from "../models/studyLanguage";
import { LanguageServiceAgent } from "../services/serviceAgents/languageServiceAgent.service";
import { LanguageService } from "ddp-sdk";

@Component({
  selector: 'ddp-language-selector',
  template: `
    <div [hidden]="!loaded">
      <button class="SimpleButton" [ngClass]="{'SimpleButton--Scrolled': isScrolled}" *ngIf="currentLanguage !== null && currentLanguage !== undefined" [matMenuTriggerFor]="menu">
        <svg class="ddp-globe" height="24px" width="24px">
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

  //TODO: Figure out if all of these fields are necessary
  @Input() studyGuid: string;
  @Input() isScrolled: boolean;
  public loaded: boolean;
  private studyLanguages: Array<StudyLanguage>;
  private defaultLanguage: StudyLanguage;
  private currentLanguage: StudyLanguage;
  public isLoadingError = false;
  public isNoDefaultFoundError = false;

  constructor (
    private serviceAgent: LanguageServiceAgent
  ) { }

  public ngOnInit(): void {
    //TODO: Figure out if this can be simplified
    //TODO: Do something with the error messages
    //TODO: Handle case where exactly one language is configured
    //TODO: Make sure we handle the case where no languages have been configured cleanly
    //TODO: Handle case where user is logged in and we can get the language from the profile
    //TODO: Store current language in session storage and check session storage in case we are returning from Auth0 or something
    this.serviceAgent.getConfiguredLanguages(this.studyGuid).subscribe(x => {
      if (x) {
        console.log('got configured languages: ' + JSON.stringify(x));
        this.isLoadingError = false;
        this.studyLanguages = x;
        this.findDefaultLanguage();
        if (this.currentLanguage == null) {
          this.currentLanguage = this.defaultLanguage;
        }
        if (this.studyLanguages === null) {
          this.isLoadingError = true;
        }
        else {
          this.loaded = true;
        }
      } else {
        this.isLoadingError = true;
      }
    });
  }

  private findDefaultLanguage(): void {
    //TODO: Check if this can be simplified
    this.isNoDefaultFoundError = false;
    let lang: StudyLanguage = this.studyLanguages.find(element => element.isDefault === true);
    if (lang !== undefined && lang !== null) {
      this.defaultLanguage = lang;
    } else {
      this.isNoDefaultFoundError = true;
    }
  }

  private getUnselectedLanguages(): Array<StudyLanguage> {
    //TODO: Check if this can be simplified
    if (this.studyLanguages !== null  && this.studyLanguages !== undefined) {
      return this.studyLanguages.filter(elem => elem !== this.currentLanguage);
    }
   return null;
  }

  public changeLanguage(lang: StudyLanguage) {
    this.currentLanguage = lang;



    //TODO: Implement this!
  }


}
