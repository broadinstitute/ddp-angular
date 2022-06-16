import { Component } from '@angular/core';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent {

      readonly stepsHrf = [
        'consent.pdf',
        'https://storage.googleapis.com/cmi-study-dev-assets/osteo/pdf/For%20Your%20Physician%20PDF%20-%20Linked%20on%20For%20Your%20Physician%20Page.pdf',
        'surveys.pdf',
        'Kit_Instructions.pdf',
        'tumor_samples.pdf'
    ];

  constructor() { }

}
