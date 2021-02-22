import { Component, OnInit } from '@angular/core';
import { FireCloudServiceAgent } from '../../services/serviceAgents/fireCloudServiceAgent.service';

@Component({
    selector: 'ddp-firecloud-export-study',
    template: `
    <button mat-button color="primary"
            class="button"
            [disabled]="!isLoaded"
            (click)="exportStudy()"
            [innerHTML]="'SDK.SubmitButton' | translate">
        <span translate>
            SDK.ExportStudy.Export
        </span>
    </button>
    `,
    styles: [`
         .button {
             margin: 10px -100px;
             left: 50%;
             width: 200px;
             text-align: center;
             cursor: pointer;
             transition: all 0.5s;
             display: inline-block;
         }

         .button[disabled] {
             opacity: 0.65;
             cursor: not-allowed;
         }

         .button span {
             cursor: pointer;
             display: inline-block;
             position: relative;
             transition: 0.5s;
         }

         .button:disabled span {
             cursor: not-allowed;
         }

         .button span:after {
             content: '\\00bb';
             position: absolute;
             opacity: 0;
             top: 0;
             right: -20px;
             transition: 0.5s;
         }

         .button:hover:enabled span {
             padding-right: 25px;
         }

         .button:hover:enabled span:after {
             opacity: 1;
             right: 0;
         }
    `
    ]
})
export class ExportStudyComponent implements OnInit {
    listStudiesMessage: string;
    listWorkspacesMessage: string;
    listWorkspaceNamespacesMessage: string;
    currentExportSuccessStatus: string;

    public isLoaded = false;

    constructor(private serviceAgent: FireCloudServiceAgent) {
        this.serviceAgent.currentListStudiesMessage.subscribe(x => {
            if (x !== 'default message' &&
                this.listWorkspacesMessage !== 'default message' &&
                this.listWorkspaceNamespacesMessage !== 'default message') {
                this.isLoaded = true;
            } else {
                this.isLoaded = false;
            }
        });

        this.serviceAgent.currentListWorkspacesMessage.subscribe(x => {
            if (x !== 'default message' &&
                this.listStudiesMessage !== 'default message' &&
                this.listWorkspaceNamespacesMessage !== 'default message') {
                this.isLoaded = true;
            } else {
                this.isLoaded = false;
            }
        });

        this.serviceAgent.currentListWorkspaceNamespacesMessage.subscribe(x => {
            if (x !== 'default message' &&
                this.listStudiesMessage !== 'default message' &&
                this.listWorkspacesMessage !== 'default message') {
                this.isLoaded = true;
            } else {
                this.isLoaded = false;
            }
        });
    }

    public ngOnInit(): void {
        this.serviceAgent.currentListStudiesMessage.subscribe(listStudiesMessage =>
            this.listStudiesMessage = listStudiesMessage);
        this.serviceAgent.currentListWorkspacesMessage.subscribe(listWorkspacesMessage =>
            this.listWorkspacesMessage = listWorkspacesMessage);
        this.serviceAgent.currentListWorkspaceNamespacesMessage.subscribe(listWorkspaceNamespacesMessage =>
            this.listWorkspaceNamespacesMessage = listWorkspaceNamespacesMessage);
        this.serviceAgent.currentExportSuccessStatus.subscribe(currentExportSuccessStatus =>
            this.currentExportSuccessStatus = currentExportSuccessStatus);
    }

    public exportStudy(): void {
        let successfulExport = true;
        this.serviceAgent.exportStudy(this.listStudiesMessage, this.listWorkspaceNamespacesMessage, this.listWorkspacesMessage).subscribe(
            () => {
                this.serviceAgent.changeExportSuccessStatus(successfulExport);
                this.showExportStatus();
            },
            () => {
                successfulExport = false;
                this.serviceAgent.changeExportSuccessStatus(successfulExport);
                this.showExportStatus();
            });
    }

    private showExportStatus(): void {
        alert(this.currentExportSuccessStatus);
    }
}
