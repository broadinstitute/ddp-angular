import { Component, Inject, Input, OnChanges } from '@angular/core';
import { SessionMementoService } from '../services/sessionMemento.service';
import { ConfigurationService } from '../services/configuration.service';
import { InvitationPipe } from '../pipes/invitationFormatter.pipe';

interface SubjectField {
    label: string;
    value: string;
}

@Component({
    selector: 'ddp-subject-panel',
    template: `
        <div *ngIf="isAdmin() && hasUserData()" class="ddp-subject-panel">
            <div class="subject-panel-container">
                <a [routerLink]="'/' + adminPage()" class="ddp-subject-panel__text bold">
                    <mat-icon>chevron_left</mat-icon>
                    <span class="Link" translate>SDK.SubjectPanel.Link</span>
                </a>
                <div>
                    <p *ngFor="let field of subjectFields" class="ddp-subject-panel__text ddp-subject-panel_inline">
                        <span translate class="ddp-subject-panel__text-label">{{field.label}}</span>
                        <b>{{ field.value }}</b>
                    </p>
                </div>
            </div>
        </div>`,
    styles: [`
        .ddp-subject-panel__text {
            display: flex;
            align-items: center;
            margin: 0;
            text-decoration: none !important;
        }

        .subject-panel-container {
            max-width: 1450px;
            padding: 1rem 1.5625rem;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin: 0 auto;
        }

        .ddp-subject-panel__text-label {
            padding-right: 4px;
        }

        @media only screen and (max-width: 710px) {
            .subject-panel-container {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `
    ],
})
export class SubjectPanelComponent implements OnChanges {
    // todo: replace list of inputs with one input of SearchParticipant type once new prism will be integrated to
    //  testboston, rgp and atcp projects
    @Input() name: string;
    @Input() shortId: string;
    @Input() email: string;
    @Input() invitationId: string;

    public subjectFields: SubjectField[] = [];

    constructor(
        private session: SessionMementoService,
        private invitationPipe: InvitationPipe,
        @Inject('ddp.config') private config: ConfigurationService) { }

    ngOnChanges(): void {
        this.subjectFields = [
            ...(this.name ? [{label: 'SDK.SubjectPanel.Name', value: this.name}] : []),
            ...(this.email ? [{label: 'SDK.SubjectPanel.ShortId', value: this.email}] : []),
            ...(this.shortId ? [{label: 'SDK.SubjectPanel.Email', value: this.shortId}] : []),
            ...(this.invitationId
                ? [{label: 'SDK.SubjectPanel.InvitationCode', value: this.invitationPipe.transform(this.invitationId)}]
                : []),
        ];
    }

    public isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public adminPage(): string {
        return this.config.lookupPageUrl;
    }

    public hasUserData(): boolean {
        return !!this.shortId || !!this.email || !!this.invitationId;
    }
}
