import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import {
  ActivityInstance,
  CompositeDisposable,
  ConfigurationService,
  LanguageService,
  UserActivityServiceAgent,
} from 'ddp-sdk';

import { StudyPerson } from '../../models/StudyPerson';
import { StudyMessagesService } from '../../services/study-messages.service';
import { filter, take } from 'rxjs/operators';
import { Routes } from '../../routes';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  loading = false;
  persons: StudyPerson[] = [];
  activities: ActivityInstance[] = [];
  Routes = Routes;
  private subs = new CompositeDisposable();

  constructor(
    private userActivityService: UserActivityServiceAgent,
    private languageService: LanguageService,
    private studyMessagesService: StudyMessagesService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupLanguageListener();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  private loadData(): void {
    this.loading = true;

    forkJoin([this.loadPersonMessages(), this.loadActivities()]).subscribe(
      ([persons, activities]) => {
        this.persons = persons;
        this.activities = activities;

        this.loading = false;
      },
    );
  }

  private loadActivities(): Observable<ActivityInstance[]> {
    return this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(take(1));
  }

  private loadPersonMessages(): Observable<StudyPerson[]> {
    return this.studyMessagesService.getPersonMessages();
  }

  private setupLanguageListener(): void {
    const sub = this.languageService
      .getProfileLanguageUpdateNotifier()
      .pipe(filter(v => v !== null))
      .subscribe(() => {
        this.loadData();
      });

    this.subs.addNew(sub);
  }
}
