import {
    ChangeDetectionStrategy,
    Component, EventEmitter,
    Input, Output
} from '@angular/core';

@Component({
    selector: 'ddp-download-file',
    template: `
        <div id="fileDownloadButton" class="fileDownloadButton">
            <button [disabled]="isLoading || isError" (click)="downloadFile()"
                    class='button button_medium button_primary button_right downloadButton'>
                <ng-container *ngIf="!isLoading else spinner">
                    {{btnText}}
                </ng-container>
            </button>
        </div>

        <ng-container *ngIf="isError">
            <p>This file is not available. Please contact the study team at
                <a href="mailTo: info@lmsproject.org">info@lmsproject.org</a> or
                <a href="tel: 651-403-5556">651-403-5556</a>
                if you have any questions.
            </p>
        </ng-container>

        <ng-template #spinner>
            <div class="loading-spinner"></div>
        </ng-template>
    `,
    styles: [`
        .loading-spinner {
            display: flex;
            align-items: center;
            width: 28px;
            height: 28px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            -webkit-animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { -webkit-transform: rotate(360deg); }
        }
        @-webkit-keyframes spin {
            to { -webkit-transform: rotate(360deg); }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadFileComponent {
    @Input() btnText: string = 'Download';
    @Input() isLoading: boolean = false;
    @Input() isError: boolean = false;

    @Output() btnClicked = new EventEmitter<void>();


    public downloadFile(): void {
        this.btnClicked.emit();
    }

}
