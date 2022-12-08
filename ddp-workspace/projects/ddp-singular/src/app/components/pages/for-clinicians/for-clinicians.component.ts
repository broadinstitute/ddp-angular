import { Component } from '@angular/core';
import { AnalyticsEventsService } from 'ddp-sdk';

import { GTagEvent } from '../../../constants/gtag-event';

@Component({
  selector: 'app-for-clinicians',
  styleUrls: ['./for-clinicians.component.scss'],
  template: `
    <div class="container">
      <section class="uncovering">
        <h1>For Clinicians</h1>
        <div class="wrapper">
          <div class="left">
            <p>
              It is our hope that clinicians who care for single ventricle patients will share information about Project
              Singular with their patients and families. We have created Project Singular brochures and flyers which we
              can provide to you by mail.
            </p>
            <p>
              If you are interested in receiving these materials for your center or clinic, you can contact us by
              email at <a (click)="contactEmail($event)" href="mailto:contact@projectsingular.org">contact@projectsingular.org</a>
              or <a (click)="contactPhone($event)" href="tel:+(650)7616486">(650) 561-6750</a>. Please provide the
              name of the recipient of these materials and their email address, phone number, and direct mailing address
            </p>
            <p>
              Thank you for helping spread the word about Project Singular to single ventricle patients and families!
            </p>
          </div>
          <div class="right">
            <img src="assets/images/stethoscope.jpg" alt="Stethoscope image" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ForCliniciansComponent {
  constructor(private analytics: AnalyticsEventsService){}

  public contactEmail(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.EMAIL_CONTACT, link.innerText, link.href);
  }

  public contactPhone(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.PHONE_CONTACT, link.innerText, link.href);
  }
}
