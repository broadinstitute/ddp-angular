import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionMementoService } from '../services/sessionMemento.service';

@Component({
    selector: 'ddp-admin-action-panel',
    template: `
        <div *ngIf="shouldDisplay()" class="ddp-admin-action-panel">
            <div class="admin-action-panel-container">
                <p class="ddp-admin-action-panel__text">
                    {{ 'SDK.AdminActionPanel.ActivityEdit' | translate }}
                </p>
                <button class="button button_small button_primary ButtonFilled" (click)="emitActivityEdit()">
                    {{ 'SDK.AdminActionPanel.EditButton' | translate }}
                </button>
            </div>
        </div>`,
    styles: [`
        .ddp-admin-action-panel__text {
            margin: 0 10px 0 0;
        }

        .admin-action-panel-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 auto;
        }

        @media only screen and (max-width: 710px) {
            .ddp-admin-action-panel__text {
                margin: 0 0 10px 0;
            }

            .admin-action-panel-container {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `]
})
export class AdminActionPanelComponent {
    @Input() public activityReadonly: boolean;
    @Output() requestActivityEdit: EventEmitter<boolean> = new EventEmitter(false);

    constructor(private session: SessionMementoService) { }

    // Only display for study admins and if activity is read-only.
    public shouldDisplay(): boolean {
        return this.session.isAuthenticatedAdminSession() &&
            !!this.session.session.participantGuid &&
            this.activityReadonly;
    }

    public emitActivityEdit(): void {
        this.requestActivityEdit.emit(true);
    }
}
