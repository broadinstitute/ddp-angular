import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from '../services/configuration.service';
import { CommunicationAspect } from '../services/communicationAspect.service';

@Component({
    selector: 'ddp-new-request-mock',
    template: `
    <h2 mat-dialog-title>Add new request</h2>
    <mat-dialog-content>
        <div class="example-container">
            <mat-form-field data-ddp-test="selectHttpVerb">
                <mat-select placeholder="HTTP verb"
                            [(value)]="verb">
                    <mat-option value="GET" data-ddp-test="selectHttpVerb::GET">GET</mat-option>
                    <mat-option value="PUT" data-ddp-test="selectHttpVerb::PUT">PUT</mat-option>
                    <mat-option value="POST" data-ddp-test="selectHttpVerb::POST">POST</mat-option>
                    <mat-option value="PATCH" data-ddp-test="selectHttpVerb::PATCH">PATCH</mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field data-ddp-test="requestUrl">
                <input matInput placeholder="URL" [(ngModel)]="url">
            </mat-form-field>
        </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
        <button mat-button
                [disabled]="!canSave"
                (click)="save()"
                data-ddp-test="okButton">
                SAVE
        </button>
        <button mat-button
                mat-dialog-close
                data-ddp-test="cancelButton">
                CANCEL
        </button>
    </mat-dialog-actions>
    `
})
export class NewRequestMock {
    public verb: string;
    public url: string;

    constructor(
        public dialogRef: MatDialogRef<NewRequestMock>,
        @Inject('ddp.config') private configuration: ConfigurationService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.url = this.configuration.backendUrl;
    }

    public save(): void {
        CommunicationAspect.interceptedFeeds.push({
            key: `${this.verb} ${this.url}`,
            mock: null,
            mocked: false,
            supportedCodes: [200],
            mockedCode: 200,
            returnNull: false,
        });
        this.dialogRef.close();
    }

    public get canSave(): boolean {
        return this.verb && this.verb !== '' && this.url && this.url !== '';
    }
}
