import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

import { AnalyticsEventsService } from 'ddp-sdk';
import { Route } from '../../../constants/route';
import { GTagEvent } from '../../../constants/gtag-event';
import { IGNORE_ANALYTICS_CLASS } from '../../../constants/analytics';
import { FamilyEnrollmentMessageComponent } from '../../family-enrollment-message/family-enrollment-message.component';
import { getFeatureFlags$ } from '../../../config/feature-flags/feature-flags-setup';
import { FeatureFlags } from '../../../config/feature-flags/feature-flags';
import { FeatureFlagsEnum } from '../../../config/feature-flags/feature-flags.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  Route = Route;
  readonly IGNORE_ANALYTICS_CLASS = IGNORE_ANALYTICS_CLASS;
  readonly ADDITIONAL_VENTURES_URL = 'https://www.additionalventures.org';
  readonly BROAD_INSTITUTE_URL = 'https://www.broadinstitute.org';
  readonly BOSTON_HOSPITAL_URL = 'https://www.childrenshospital.org';
  readonly GENOME_MEDICAL_URL = 'https://www.genomemedical.com';
  readonly CONSENT_PDF_URL = 'https://storage.googleapis.com/singular-dev-assets/consent_self.pdf';
  readonly SALIVA_KIT_PDF_URL = 'https://storage.googleapis.com/singular-dev-assets/saliva_kit.pdf';
  readonly SALIVA_KIT_PDF_NAME = 'Preview Kit Instructions';
  readonly CONSENT_PDF_NAME = 'Preview Consent Form';
  readonly PRESCREEN_BUTTON_LABEL = 'Sign me up!';

  readonly featureFlag_DDP_8404 = getFeatureFlags$().pipe(
    map((flags: FeatureFlags) => flags[FeatureFlagsEnum.DDP_8404_Home_page_update])
  );

  constructor(
    private analytics: AnalyticsEventsService,
    private dialog: MatDialog
  ) {
  }

  public clickPreScreening(): void {
    this.analytics.emitCustomGtagEvent(GTagEvent.SIGN_UP_CLICK, this.PRESCREEN_BUTTON_LABEL);
  }
  public clickDownload(clickText: string, clickUrl: string): void {
    this.analytics.emitCustomGtagEvent(GTagEvent.PDF_DOWNLOAD, clickText, clickUrl);
  }

  openDialog(): void {
    this.dialog.open(FamilyEnrollmentMessageComponent, {
      width: '95%',
      maxWidth: '640px',
      autoFocus: false,
    });
  }
}
