import { Component } from '@angular/core';

@Component({
    selector: 'app-participation',
    templateUrl: './participation.component.html',
    styleUrls: ['./participation.component.scss']
})
export class ParticipationComponent {
    readonly stepsHref = [
        'consent.pdf',
        'medical_release.pdf',
        'surveys.pdf',
        'assets/images/kit_instructions.jpg'
    ];
}
