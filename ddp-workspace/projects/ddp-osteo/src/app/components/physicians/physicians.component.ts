import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styleUrls: ['./physicians.component.scss']
})
export class PhysiciansComponent implements OnInit {

      readonly stepsHrf = [
        'consent.pdf',
        'For_physic.pdf',
        'surveys.pdf',
        'Kit_Instructions.pdf',
        'tumor_samples.pdf'
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
