import { Component, Inject, Input, OnChanges } from '@angular/core';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { ConfigurationService } from '../../services/configuration.service';
import { InvitationPipe } from '../../pipes/invitationFormatter.pipe';

interface SubjectField {
    label: string;
    value: string;
}

@Component({
    selector: 'ddp-subject-panel',
    templateUrl: './subjectPanel.component.html',
    styleUrls: ['./subjectPanel.component.scss'],
})
export class SubjectPanelComponent implements OnChanges {
    // todo: replace list of inputs with one input of SearchParticipant type once new prism will be integrated to testboston
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
            ...(this.email ? [{label: 'SDK.SubjectPanel.Email', value: this.email}] : []),
            ...(this.shortId ? [{label: 'SDK.SubjectPanel.ShortId', value: this.shortId}] : []),
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
