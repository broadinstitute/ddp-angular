import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserProfileServiceAgent } from 'ddp-sdk';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
    selector: 'app-root',
    template: `
            <div class="MainContainer">
                <router-outlet></router-outlet>
            </div>
            <toolkit-footer></toolkit-footer>
    `
})
export class AppComponent implements OnInit{

    constructor(
        private translate: TranslateService,
        private userProfile: UserProfileServiceAgent,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.initTranslate();
    }

    private initTranslate(): void {
        const session = localStorage.getItem('session_key');
        if (session != null) {
            const locale = JSON.parse(session).locale;
            this.translate.use(locale);
        }
    }
}
