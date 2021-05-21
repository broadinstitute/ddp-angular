import { Component, Inject, Input, OnInit } from '@angular/core';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { ConfigurationService } from '../../services/configuration.service';
import { InvitationPipe } from '../../pipes/invitationFormatter.pipe';
import { SearchParticipant } from '../../models/searchParticipant';

interface SubjectField {
    label: string;
    value: string;
}

@Component({
    selector: 'ddp-subject-panel',
    templateUrl: './subjectPanel.component.html',
    styleUrls: ['./subjectPanel.component.scss'],
})
export class SubjectPanelComponent implements OnInit {
    @Input() subject: SearchParticipant;

    public subjectFields: SubjectField[] = [];

    constructor(
        private session: SessionMementoService,
        private invitationPipe: InvitationPipe,
        @Inject('ddp.config') private config: ConfigurationService) { }

    ngOnInit(): void {
        if (this.subject) {
            this.subjectFields = [
                ...(this.subject.firstName || this.subject.lastName
                    ? [{label: 'SDK.SubjectPanel.Name', value: (this.subject.firstName + ' ' + this.subject.lastName)}]
                    : []),
                ...(this.subject.email || this.subject.proxy?.email
                    ? [{label: 'SDK.SubjectPanel.Email', value: this.subject.email || this.subject.proxy?.email}]
                    : []),
                ...(this.subject.hruid ? [{label: 'SDK.SubjectPanel.ShortId', value: this.subject.hruid}] : []),
                ...(this.subject.invitationId
                    ? [{label: 'SDK.SubjectPanel.InvitationCode', value: this.invitationPipe.transform(this.subject.invitationId)}]
                    : []),
            ];
            // todo: remove once new prism will be integrated to testboston
        } else if (this.session.session.invitationId) {
            this.subjectFields = [{
                label: 'SDK.SubjectPanel.InvitationCode',
                value: this.invitationPipe.transform(this.session.session.invitationId)
            }];
        }
    }

    public isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }

    public adminPage(): string {
        return this.config.lookupPageUrl;
    }

    public hasUserData(): boolean {
        // todo: remove once new prism will be integrated to testboston
        return !!this.subject || !!this.session.session.invitationId;
    }
}
