import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lms-page',
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.scss']
})
export class LmsPageComponent implements OnInit {
    readonly phone: string;
    readonly email: string;
    emailToNotify: FormControl;
    readonly AppRoutes = AppRoutes;

    constructor(@Inject('toolkit.toolkitConfig') config: ToolkitConfigurationService) {
        this.phone = config.lmsPagePhone;
        this.email = config.lmsPageEmail;
    }

    ngOnInit(): void {
        this.emailToNotify = new FormControl('');
    }

    notify(): void {
        console.log('Notify me');
    }
}
