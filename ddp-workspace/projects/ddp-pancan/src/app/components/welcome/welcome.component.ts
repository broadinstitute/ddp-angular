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
        {key: 'Step1', img: 'Step1.png'},
        {key: 'Step2', img: 'Step3.png'},
        {key: 'Step3', img: 'Step4_big.png'},
        {key: 'Step4', img: 'Step5.png'}
    ];
}
