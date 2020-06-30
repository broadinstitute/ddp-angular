import { Component, Inject } from '@angular/core';
import { SessionMementoService } from '../services/sessionMemento.service';
import { ConfigurationService } from '../services/configuration.service';

@Component({
    selector: 'ddp-subject-panel',
    template: `
        <div *ngIf="isAdmin() && !!invitationId()" class="ddp-subject-panel">
            <div class="subject-panel-container">
                <a [routerLink]="'/' + adminPage()" class="Link ddp-subject-panel__text bold">
                    <mat-icon>chevron_left</mat-icon>
                    <span translate>SDK.SubjectPanel.Link</span>
                </a>
                <div>
                    <p class="ddp-subject-panel__text ddp-subject-panel_inline">
                        <span translate>SDK.SubjectPanel.Text</span>
                        <span class="bold">{{ invitationId() | invitation }}</span>
                    </p>
                </div>
            </div>
        </div>`
})
export class SubjectPanelComponent {
    constructor(
        private session: SessionMementoService,
        @Inject('ddp.config') private config: ConfigurationService) { }

    public isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public invitationId(): string | null {
        return this.session.session.invitationId;
    }

    public adminPage(): string {
        return this.config.lookupPageUrl;
    }
}
