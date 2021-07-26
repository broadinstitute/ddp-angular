import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';
import { CommunicationService } from 'toolkit';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
    readonly AppRoutes = AppRoutes;
    twitterUrl: string;
    facebookUrl: string;
    instagramUrl: string;

    constructor(private communicationService: CommunicationService) {}

    public openJoinMailingList(): void {
        this.communicationService.openJoinDialog();
    }
}
