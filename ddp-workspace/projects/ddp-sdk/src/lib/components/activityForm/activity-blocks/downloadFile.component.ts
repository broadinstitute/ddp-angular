import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';

@Component({
    selector: 'ddp-download-file',
    template: `
        <div id="fileDownloadButton" class="fileDownloadButton">
            <button (click)="downloadPDF()" class='button button_medium button_primary button_right downloadButton'>Download PDF</button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadFileComponent {
    @Input() downloadURL: string;

    public downloadPDF(): void {
        window.open(this.downloadURL, '_blank');
    }
}
