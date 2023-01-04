import { Component } from '@angular/core';

@Component({
  selector: 'app-how-to-participate',
  templateUrl: './how-to-participate.component.html',
  styleUrls: ['./how-to-participate.component.scss'],
})
export class HowToParticipateComponent {

  consent = 'https://storage.googleapis.com/cmi-study-dev-assets/lms/pdf/Adult%20Reseach%20Consent%20Form%20V7%20CLEAN%20LMS%2016Dec%202022.pdf';
  medical_release = 'https://storage.googleapis.com/cmi-study-dev-assets/lms/pdf/LMS%20Medical%20Release%20Form%20-%20Adult.pdf';
  kit = 'https://storage.googleapis.com/cmi-study-dev-assets/lms/pdf/Kit%20Instructions%20-%20Linked%20on%20Participation%20Page.pdf';
  survey = 'https://storage.googleapis.com/cmi-study-dev-assets/lms/pdf/LMS%20About%20You_Your%20LMS%20Survey.pdf';
  tumorSamples = 'https://storage.googleapis.com/cmi-study-dev-assets/lms/pdf/Shared%20Learnings%20Letter.pdf';

    readonly stepsHref = [
      this.consent,
      this.medical_release,
      this.survey,
      this.kit,
      this.tumorSamples,
    ];

  readonly stepsHrf = [
    '',
    this.tumorSamples,


  ];
}
