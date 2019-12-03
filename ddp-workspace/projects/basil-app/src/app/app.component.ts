import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService, SessionMementoService, UserProfileServiceAgent } from 'ddp-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public logoUrl: string;
  public currentLocale: string = 'en';
  private anchor: Subscription;

  constructor(
    private sessionService: SessionMementoService,
    private router: Router,
    private translate: TranslateService,
    private serviceAgent: UserProfileServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService) {
    this.translate.setDefaultLang('en');
    this.anchor = this.serviceAgent.profile.subscribe(x => {
      if (x && x.profile) {
        this.currentLocale = x.profile.preferredLanguage != null ? x.profile.preferredLanguage : 'en';
        this.translate.use(this.currentLocale);
      }
    });
  }

  public ngOnInit(): void {
    this.logoUrl = this.config.baseUrl + '/assets/angiosarcoma-project-isotype.svg';
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public logout(): void {
    this.router.navigateByUrl('/welcome');
  }

  public isUserAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }
}
