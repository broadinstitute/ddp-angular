import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent, DEFAULT_DIALOG_SETTINGS } from 'ddp-sdk';
import { WorkflowCommand } from '../../models/workflowCommand';
import { StudyRedirectWorkflowAction } from '../../models/actions/studyRedirectWorkflowAction';

@Injectable()
export class StudyRedirectCommand implements WorkflowCommand {
    constructor(
        private dialog: MatDialog,
        private action: StudyRedirectWorkflowAction
    ) {}

    public execute(): Observable<void> {
        this.openDialog();
        return new Observable(e => e);
    }

    private openDialog(): void {
        const config = {
            ...DEFAULT_DIALOG_SETTINGS,
            panelClass: 'study-redirect-dialog',
            maxWidth: '500px',
            data: {
                title: 'Toolkit.Dialogs.StudyRedirect.Title',
                content: 'Toolkit.Dialogs.StudyRedirect.Content',
                contentSubstitutions: {
                    study: this.action.data.studyName
                },
                confirmBtnText: 'Toolkit.Dialogs.StudyRedirect.GoToProject',
                cancelBtnText: 'Toolkit.Dialogs.StudyRedirect.Cancel',
                confirmBtnColor: 'primary'
            }
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
        dialogRef.afterClosed().subscribe((confirmRedirect: boolean) => {
            if (!confirmRedirect) {
                window.location.reload();
            }
            this.action.data && this.redirect(this.action.data.redirectUrl);
        });
    }

    private redirect(url: string): void {
        window.location.href = url;
    }
}
