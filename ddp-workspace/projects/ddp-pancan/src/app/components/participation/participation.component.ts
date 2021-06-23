import { Component } from '@angular/core';

interface StepData {
    img: string;
    link?: string;
}

@Component({
    selector: 'app-participation',
    templateUrl: './participation.component.html',
    styleUrls: ['./participation.component.scss']
})
export class ParticipationComponent {
    readonly stepsData: StepData[] = [
        { img: 'step1_big.png', link: 'consent.pdf' },
        { img: 'step2_big.png', link: 'medical_release.pdf' },
        { img: 'step3_big.png', link: 'surveys.pdf' },
        { img: 'step4_big.png', link: 'kit-instructions.pdf' },
        { img: 'step5_big.png' }
    ];
}
