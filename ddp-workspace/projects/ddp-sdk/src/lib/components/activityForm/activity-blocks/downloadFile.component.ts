import {
    ChangeDetectionStrategy,
    Component, EventEmitter,
    Input, Output
} from '@angular/core';

@Component({
    selector: 'ddp-download-file',
    template: `
        <div id="fileDownloadButton" class="fileDownloadButton">
            <button [disabled]="isLoading || isError" (click)="onButtonClick()"
                    class='button button_medium button_primary button_right downloadButton'>
                <ng-container *ngIf="!isLoading else spinner">
                    {{btnText}}
                </ng-container>
            </button>
        </div>

<!--        any additional content goes here-->
        <ng-content></ng-content>

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
    @Input() btnText = 'Download';
    @Input() isLoading = false;
    @Input() isError = false;

    @Output() btnClicked = new EventEmitter<void>();


    public onButtonClick(): void {
        this.btnClicked.emit();
    }

}
