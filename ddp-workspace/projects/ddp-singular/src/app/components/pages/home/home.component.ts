import { Component } from '@angular/core';
import { Route } from '../../../constants/route';
import { AnalyticsEventsService } from 'ddp-sdk';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  Route = Route;
  readonly ADDITIONAL_VENTURES_URL = 'https://www.additionalventures.org';
  readonly BROAD_INSTITUTE_URL = 'https://www.broadinstitute.org';
  readonly BOSTON_HOSPITAL_URL = 'https://www.childrenshospital.org';
  readonly GENOME_MEDICAL_URL = 'https://www.genomemedical.com';
  readonly CONSENT_PDF_URL = 'https://storage.googleapis.com/singular-dev-assets/consent_self.pdf';
  readonly SALIVA_KIT_PDF_URL = 'https://storage.googleapis.com/singular-dev-assets/saliva_kit.pdf';
  readonly SALIVA_KIT_PDF_NAME = 'Preview Kit Instructions';
  readonly CONSENT_PDF_NAME = 'Preview Consent Form';
  readonly PRESCREEN_BUTTON_LABEL = 'Sign me up!';


  constructor(private analytics: AnalyticsEventsService){}

  public clickPreScreening(): void {
    this.analytics.emitCustomGtagEvent('sign_me_up_button_link', this.PRESCREEN_BUTTON_LABEL);
  }
  public clickDownload(clickText: string, clickUrl: string): void {
    this.analytics.emitCustomGtagEvent('pdf_download', clickText, clickUrl);
  }
}
