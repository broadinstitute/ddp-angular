import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {ActivityQuestionBlock, ServiceAgent, UserServiceAgent} from "ddp-sdk";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
    selector: 'ddp-download-file',
    template: `
        <button (click)="downloadPDF()" class='button button_medium button_primary button_right downloadButton'>Download PDF</button>
    `,
    styles: [`
        button.downloadButton {
            margin-top: 1em;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadFileComponent implements OnChanges {
    @Input() block: ActivityQuestionBlock<any>;
    @Input() studyGuid: string;
    @Input() activityGuid: string;


    constructor(private readonly cdr: ChangeDetectorRef,
                private readonly http: HttpClient) {
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes, 'CHANGES')
    }

    public downloadPDF() {
        console.log(this.block, 'BLOCK_FROM_DOWNLOAD_FILE')
        const URL = 'https://www.smth.com/' + this.block.answer
        const url = `https://pepper-dev.datadonationplatform.org/pepper/v1/user/T94BZTLZ55IM9E1JFBCH/studies/${this.studyGuid}/activities/${this.activityGuid}/downloads`
        this.http.get(url, {headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
        })}).subscribe((data) => console.log(data, 'FILE'))
        // window.open(URL, '_BLANK')
    }
}
