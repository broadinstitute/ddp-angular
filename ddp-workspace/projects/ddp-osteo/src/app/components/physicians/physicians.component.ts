import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent implements OnInit {

      readonly stepsHref = [
        'consent.pdf',
        'medical_release.pdf',
        'surveys.pdf',
        'Kit_Instructions.pdf',
        'tumor_samples.pdf'
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
