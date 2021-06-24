import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
    readonly AppRoutes = AppRoutes;

    /* the numeration of images is not in order because 2d step is skipped here
       in comparison with full (5) steps on Participation page */
    readonly participationStepsImages = [
        'step1.png',
        'step3.png',
        'step4.png',
        'step5.png'
    ];
    twitterUrl: string;
    facebookUrl: string;
    instagramUrl: string;
}
