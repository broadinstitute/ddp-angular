import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-for-your-physician',
  templateUrl: './for-your-physician.component.html',
  styleUrls: ['./for-your-physician.component.scss'],
})
export class ForYourPhysicianComponent implements OnInit, OnDestroy {
  public phone: string;
  public phoneHref: string;
  public currentLang: string;
  private ngUnsub = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    @Inject('toolkit.toolkitConfig')
    private toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.currentLang = this.translateService.currentLang;

    this.translateService.onLangChange
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(({ lang }) => {
        this.currentLang = lang;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsub.next();
  }
}
