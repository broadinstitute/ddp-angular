import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-stay-informed-section',
    templateUrl: './stay-informed-section.component.html',
    styleUrls: ['./stay-informed-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StayInformedSectionComponent implements OnInit {
    readonly AppRoutes = AppRoutes;
    twitterUrl: string;
    facebookUrl: string;

    constructor(
        private communicationService: CommunicationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService
    ) {}

    ngOnInit(): void {
        this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
        this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    }

    public openJoinMailingList(): void {
        this.communicationService.openJoinDialog();
    }
}
