import {Component, OnInit} from '@angular/core';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {Statics} from '../utils/statics';
import {Utils} from '../utils/utils';
import {ActivatedRoute} from '@angular/router';
import {PhiManifestResponseModel} from './phi-manifest-response.model';
import {PhiManifestModel} from './phi-manifest.model';

@Component({
    selector: 'app-phi-manifest',
    templateUrl: './phi-manifest.component.html',
    styleUrls: ['./phi-manifest.component.scss']
})

export class PhiManifestComponent implements OnInit {
    errorMessage: string;
    additionalMessage: string;
    loading = false;
    realm: string;
    participantId: string = null;
    sequencingOrderId: string = null;
    allowedToSeeInformation = false;

    constructor(private dsmService: DSMService, private auth: Auth, private route: ActivatedRoute) {
        if (!auth.authenticated()) {
            auth.sessionLogout();
        }
        this.route.queryParams.subscribe(params => {
            this.realm = params[DSMService.REALM] || null;
            if (this.realm != null) {
                this.checkRight();
            }
        });
    }

    private checkRight(): void {
        this.allowedToSeeInformation = false;
        this.additionalMessage = null;
        let jsonData: any[];
        this.dsmService.getRealmsAllowed(Statics.MEDICALRECORD).subscribe({
            next: data => {
                jsonData = data;
                jsonData.forEach((val) => {
                    if (this.realm === val) {
                        this.allowedToSeeInformation = true;
                    }
                });
                if (!this.allowedToSeeInformation) {
                    this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
                }
            },
            error: () => null
        });
    }

    ngOnInit(): void {
        if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
            this.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
            this.checkRight();
        } else {
            this.additionalMessage = 'Please select a PE-CGS study';
        }
        window.scrollTo(0, 0);
    }

    downloadPhiReport(): void {
        this.additionalMessage = null;
        this.errorMessage = null;
        if (this.realm != null && this.participantId && this.sequencingOrderId) {
            this.loading = true;
            this.dsmService.getPhiReport(this.realm, this.participantId, this.sequencingOrderId).subscribe(
                {// need to subscribe, otherwise it will not send!
                next: data => {
                    // console.info(`received: ${JSON.stringify(data, null, 2)}`);
                    const phiManifestResponse = PhiManifestResponseModel.parse(data);
                    this.loading = false;
                    this.downloadManifest(phiManifestResponse);
                },
                error: err => {
                    // console.log(err);
                    if (err._body === Auth.AUTHENTICATION_ERROR) {
                        this.auth.doLogout();
                    }
                    this.errorMessage = 'Error - Failed to download report ' + err.error;
                    this.loading = false;
                }
            });
        } else {
            this.errorMessage = 'Please select a study and enter information';
        }
    }

    public downloadManifest(phiManifestResponseModel: PhiManifestResponseModel): void {
        if (phiManifestResponseModel.errorMessage) {
            this.additionalMessage = 'Error - ' + phiManifestResponseModel.errorMessage;
            return;
        }
        const phiManifestModel: PhiManifestModel = PhiManifestModel.parse(phiManifestResponseModel.data[1]);
        const map: {}[] = [];
        map.push(phiManifestModel.getReportAsMap(phiManifestResponseModel.data[0], phiManifestResponseModel.data[1]));
        Utils.createCSV(phiManifestResponseModel.data[0], map, this.createFileName(phiManifestResponseModel));
    }

    createFileName(phiManifestResponseModel: PhiManifestResponseModel): string {
      return 'PHI_REPORT_PT_' + phiManifestResponseModel.ddpParticipantId + '_ORDER_' +
      phiManifestResponseModel.orderId + '_' + Utils.getDateFormatted( new Date(), Utils.DATE_STRING_CVS ) +
      Statics.CSV_FILE_EXTENSION;
    }


}
