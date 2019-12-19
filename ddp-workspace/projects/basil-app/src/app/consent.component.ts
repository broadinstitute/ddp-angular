import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CompositeDisposable, ActivityServiceAgent, UserActivityServiceAgent } from 'ddp-sdk';
import { UserStateService } from './services/userState.service';
import { UserState } from './model/userState';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html'
})
export class ConsentComponent implements OnDestroy {
  @Output() submit: EventEmitter<void> = new EventEmitter();
  public studyGuid = 'TESTSTUDY1';
  public instanceGuid: string;
  private anchor: CompositeDisposable;
  private consentCode = '1S2G7MIPZT';

  constructor(private state: UserStateService,
    private serviceAgent: ActivityServiceAgent,
    private listServiceAgent: UserActivityServiceAgent,
    private router: Router) {
    this.anchor = new CompositeDisposable();
    const get = listServiceAgent.getActivities(of(this.studyGuid))
      .subscribe(x => {
        const element = x.find(y => y.activityCode == this.consentCode);
        if (element) {
          this.instanceGuid = element.instanceGuid;
        } else {
          this.createConsent();
        }
      });
    this.anchor.addNew(get);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  private createConsent(): void {
    const create = this.serviceAgent.createInstance(this.studyGuid, this.consentCode)
      .subscribe(x => !!x && (this.instanceGuid = x.instanceGuid));
    this.anchor.addNew(create);
  }

  public raiseSubmit(): void {
    this.state.refreshState().subscribe(x => {
      if (x == UserState.NotConsented) {
        this.router.navigateByUrl('consent-declined');
      } else if (x == UserState.Dashboard) {
        this.router.navigateByUrl('dashboard');
      }
    });
  }
}
