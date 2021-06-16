import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
    readonly AppRoutes = AppRoutes;
    readonly participationSteps = [
        {key: 'Step1', img: 'step1.png'},
        {key: 'Step2', img: 'step3.png'},
        {key: 'Step3', img: 'step4.png'},
        {key: 'Step4', img: 'step5.png'}
    ];
    twitterUrl: string;
    facebookUrl: string;
    instagramUrl: string;
}
