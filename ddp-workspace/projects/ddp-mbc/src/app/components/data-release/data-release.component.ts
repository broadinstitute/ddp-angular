import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { DisclaimerComponent, ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'app-data-release',
    styleUrls: ['data-release.component.scss'],
    templateUrl: 'data-release.component.html'
})
export class DataReleaseComponent implements OnInit {
    public dataEmail: string;
    public infoEmail: string;
    public dataEmailHref: string;
    public iframeWidth: number;
    public iframeHeight: number;

    constructor(private dialog: MatDialog,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.dataEmail = this.toolkitConfiguration.dataEmail;
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.dataEmailHref = `mailto:${this.toolkitConfiguration.dataEmail}`;
        this.iframeWidth = this.isMobile ? 400 : 1200;
        this.iframeHeight = this.isMobile ? 300 : 830;
    }

    public scrollTo(target): void {
        target.scrollIntoView();
        window.scrollBy(0, -100);
    }

    public openDisclaimerDialog(): void {
        this.dialog.open(DisclaimerComponent, {
            width: '740px',
            position: { top: '30px' },
            data: {},
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy()
        });
    }

    public get isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
