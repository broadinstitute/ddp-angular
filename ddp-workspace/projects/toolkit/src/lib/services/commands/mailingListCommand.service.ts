import { OnDestroy, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { WorkflowCommand } from '../../models/workflowCommand';
import { JoinMailingListComponent } from './../../components/dialogs/joinMailingList.component';
import { UserProfileServiceAgent, UserProfile, UserProfileDecorator, CompositeDisposable } from 'ddp-sdk';
import { Observable, Subscriber } from 'rxjs';

@Injectable()
export class MailingListCommand implements OnDestroy, WorkflowCommand {
    private anchor: CompositeDisposable = new CompositeDisposable();
    private emitter: Subscriber<void>;

    constructor(
        private dialog: MatDialog,
        private userProfile: UserProfileServiceAgent) { }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public execute(): Observable<void> {
        this.getProfile();
        return new Observable(e => this.emitter = e);
    }

    private getProfile(): void {
        const profile = this.userProfile.profile.subscribe((decorator: UserProfileDecorator | null) => {
            decorator ? this.openDialog(decorator.profile) : this.openDialog(new UserProfile());
        });
        this.anchor.addNew(profile);
    }

    private openDialog(profile: UserProfile): void {
        const dialogRef = this.dialog.open(JoinMailingListComponent, {
            width: '740px',
            position: { top: '30px' },
            data: {
                firstName: profile.firstName,
                lastName: profile.lastName
            },
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy()
        });
        const sub = dialogRef.afterClosed().subscribe(() => {
            this.emitter.next();
        });
        this.anchor.addNew(sub);
    }
}
