import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {interval, Observable} from 'rxjs';

import { Auth } from '../services/auth.service';
import { DSMService } from '../services/dsm.service';
import { Language } from '../utils/language';
import { KitRequest } from './shipping.model';
import { KitType } from '../utils/kit-type.model';
import { Utils } from '../utils/utils';
import { RoleService } from '../services/role.service';
import { ModalComponent } from '../modal/modal.component';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';
import { EasypostLabelRate } from '../utils/easypost-label-rate.model';
import { LabelSetting } from '../label-settings/label-settings.model';
import { Result } from '../utils/result.model';
import {LocalStorageService} from '../services/localStorage.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: [ './shipping.component.css' ]
})
export class ShippingComponent implements OnInit {
  @ViewChild(ModalComponent)
  public modal: ModalComponent;

  QUEUE = 'queue';
  SENT = 'sent';
  RECEIVED = 'received';
  ERROR = 'error';
  UPLOADED = 'uploaded';
  OVERVIEW = 'overview';
  DEACTIVATED = 'deactivated';
  ACTIVATED = 'activated';
  TRIGGERED = 'triggered';

  EXPRESS = 'express';
  NAME_LABELS = 'nameLabels';

  shippingPage: string;

  allSelected = false;
  errorMessage: string;
  additionalMessage: string;

  selectedKitRequests: any[] = [];
  needsNameLabels = false;

  loading = false;

  kitTypes: Array<KitType> = [];
  kitType: KitType = null;

  kitRequests: KitRequest[] = [];

  isPrintButtonDisabled = true;

  sortField = 'default';
  sortDir = 'asc';

  kitRequest: KitRequest = null;
  deactivationReason: string = null;

  modalType: string;

  allSentSelected = false;
  isSentButtonDisabled = true;
  allowedToSeeInformation = false;

  selectedStudy$!: Observable<string>;

  public isPHI: boolean;

  public shortId: any = '';
  public shippingId: any = '';
  public externalOrderNumber: any = '';
  public externalOrderStatus: any = '';
  public reason: any = '';
  public trackingTo: any = '';
  public trackingReturn: any = '';
  public mfCode: any = '';
  public noReturn: any = '';
  public labelRate: EasypostLabelRate = null;

  labelSettings: LabelSetting[] = [];
  selectedSetting: LabelSetting;
  selectedLabel: string;
  labelNames: string[] = [];

  lastSelectedRow: number;
  selectRangeStart: number;
  selectRangeStop: number;

  kitsWithNoReturn = false;
  tmpKitRequest: KitRequest;
  alertText: string;

  constructor(private route: ActivatedRoute, private router: Router, private dsmService: DSMService, private auth: Auth,
               private role: RoleService, private compService: ComponentService, private _changeDetectionRef: ChangeDetectorRef,
               private util: Utils, private language: Language, private localStorageService: LocalStorageService) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe(params => {
      this.setShippingPage(this.router.url);
      const realm = params[ DSMService.REALM ] || null;
      if (realm != null && realm !== '') {
        //        this.compService.realmMenu = realm;
        this.checkRight();
      } else {
        this.additionalMessage = 'Please select a study';
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.checkRight();
    } else {
      this.additionalMessage = 'Please select a study';
    }

    this.selectedStudy$ = this.localStorageService.studyChange$;
    window.scrollTo(0, 0);
  }

  private checkRight(): void {
    this.allowedToSeeInformation = false;
    this.additionalMessage = null;
    this.kitType = null;
    this.kitRequests = [];
    this.kitTypes = [];
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.SHIPPING).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
            this.allowedToSeeInformation = true;
            this.getPossibleKitType();
          }
        });
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    });

    this.dsmService.getLabelSettings().subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach(() => {
          this.labelSettings = [];
          this.labelNames = [];
          this.selectedSetting = null;
          this.selectedLabel = null;
          jsonData = data;
          // TODO: check is it correct ? - shadowed variables `val`
          // eslint-disable-next-line @typescript-eslint/no-shadow
          jsonData.forEach((val) => {
            const labelSetting = LabelSetting.parse(val);
            if (labelSetting.defaultPage) {
              this.selectedSetting = labelSetting;
              this.selectedLabel = labelSetting.name;
            }
            this.labelNames.push(labelSetting.name);
            this.labelSettings.push(labelSetting);
          });
        });
      },
      error: () => null
    });
  }

  setShippingPage(url: string): void {
    if (url.indexOf(Statics.SHIPPING_QUEUE) > -1) {
      this.shippingPage = this.QUEUE;
    } else if (url.indexOf(Statics.SHIPPING_SENT) > -1) {
      this.shippingPage = this.SENT;
    } else if (url.indexOf(Statics.SHIPPING_RECEIVED) > -1) {
      this.shippingPage = this.RECEIVED;
    } else if (url.indexOf(Statics.SHIPPING_ERROR) > -1) {
      this.shippingPage = this.ERROR;
    } else if (url.indexOf(Statics.SHIPPING_UPLOADED) > -1) {
      this.shippingPage = this.UPLOADED;
    } else if (url.indexOf(Statics.SHIPPING_OVERVIEW) > -1) {
      this.shippingPage = this.OVERVIEW;
    } else if (url.indexOf(Statics.SHIPPING_DEACTIVATED) > -1) {
      this.shippingPage = this.DEACTIVATED;
    } else if (url.indexOf(Statics.SHIPPING_TRIGGERED) > -1) {
      this.shippingPage = this.TRIGGERED;
    } else {
      this.errorMessage = 'Error - Router has unknown url\nPlease contact your DSM developer';
    }
  }

  getRole(): RoleService {
    return this.role;
  }

  getPossibleKitType(): void {
    // console.log(this.realm);
    this.additionalMessage = null;
    this.kitRequests = [];
    let jsonData: any[];

    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null &&
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM) !== ''
    ) {
      this.loading = true;
      this.dsmService.getKitTypes(localStorage.getItem(ComponentService.MENU_SELECTED_REALM)).subscribe({
        next: data => {
          this.kitTypes = [];
          jsonData = data;
          jsonData.forEach((val) => {
            const kitType = KitType.parse(val);
            this.kitTypes.push(kitType);
          });
          this.loading = false;
          // console.info(`${this.kitTypes.length} kit types received: ${JSON.stringify(data, null, 2)}`);
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.additionalMessage = 'Error - Loading kit types\n' + err;
        }
      });
      this.additionalMessage = null;
    } else {
      this.kitTypes = [];
      this.additionalMessage = 'Please select a study';
    }
  }

  typeChecked(type: KitType): void {
    if (type.selected) {
      this.kitType = type;
      this.loadKitRequestData(this.kitType);
    } else {
      this.kitType = null;
      this.errorMessage = null;
      this.kitRequests = [];
    }
    for (const kit of this.kitTypes) {
      if (kit !== type) {
        if (kit.selected) {
          kit.selected = false;
        }
      }
    }
  }

  private loadKitRequestData(kitType: KitType): void {
    this.allSelected = false;
    this.errorMessage = null;
    this.needsNameLabels = false;
    this.kitsWithNoReturn = false;
    this.loading = true;

    let jsonData: any[];
    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null &&
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM) !== ''
    ) {
      this.dsmService.getKitRequests(localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.shippingPage, kitType.name)
        .subscribe({
          next: data => {
            this.kitRequests = [];
            jsonData = data;
            jsonData.forEach((val) => {
              const kit = KitRequest.parse(val);
              if (kit.noReturn) {
                this.kitsWithNoReturn = true;
              }
              this.kitRequests.push(kit);
            });

            // console.log(`${this.kitRequests.length} KitRequest data received: ${JSON.stringify(data, null, 2)}`);
            this.loading = false;
          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.auth.logout();
            }
            this.loading = false;
            this.errorMessage = 'Error - Loading kit request data\n' + err;
          }
        });
    } else {
      this.kitRequests = [];
      this.additionalMessage = 'Please select a study';
    }
  }

  selectSetting(event): void {
    this.selectedLabel = event;
    for (const setting of this.labelSettings) {
      if (setting.name === this.selectedLabel) {
        this.selectedSetting = setting;
        break;
      }
    }
  }

  showPHIButton(study: string): boolean {
    switch(study) {
      case 'osteo2':
        return true;
      default:
        return false;
    }
  }

  onPrintLabelsClick() {
    this.getSelectedList();
  }

  onPrintPHIClick() {
    this.isPHI = true;
    this.getSelectedList();
  }

  getSelectedList(): void {
    this.selectedKitRequests = KitRequest.removeUnselectedKitRequests(this.kitRequests);
    this._changeDetectionRef.detectChanges();
    this.printLabels(this.shippingPage);
  }

  private changedHtml(elementID: string): string {
    return document.getElementById(this.isPHI ? 'labelNameDOBDiv' : elementID).innerHTML;
  }

  public printLabels(target: string): any {
    let printContents = this.changedHtml('error' === target ? 'errorLabelDiv' : 'labelDiv');

    if (window) {
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        const popup = window.open('', '_blank',
          'width=800,height=600,scrollbars=no,menubar=no,toolbar=no,'
          + 'location=no,status=no,titlebar=no');

        popup.window.focus();
        popup.document.write(`
          <!DOCTYPE html><html lang="en">
          <head>
            <title></title>
            <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css" media="screen,print">
            <link rel="stylesheet" href="style.css" media="screen,print">
            <style type="text/css">
              body { margin:0; }
              @page { size: auto;  margin: 0mm; }
              @media print {
                .pagebreak {
                    clear: both;
                    page-break-after: always;
                 }
              }
            </style>
          </head>
          <body onload="window.print()">
            <div class="reward-body">${printContents}</div>
          </html>
        `);
        popup.document.close();

        // to check if the print window is still open, if it is closed, user should be navigated to scan page
        const subscription = interval(500).subscribe(() => {
          if (popup == null || popup.window == null || popup.window.closed) {
            this.closedWindow();
            subscription.unsubscribe();
          }
        });
      }
    }
    // TODO: check is it correct ? is it `return true` line needed ?
    return true;
  }

  private closedWindow(): void {
    this.selectedKitRequests = [];
    !this.kitType.manualSentTrack && !this.isPHI && this.router.navigate([Statics.SCAN_URL], {relativeTo: this.route});
    this.allSelected = false;
    this.isPHI = false;
    this.setAllCheckboxes(false);
  }

  private setAllCheckboxes(selected: boolean): void {
    this.needsNameLabels = selected && this.kitRequests[0] != null && this.kitRequests[0].nameLabel != null;
    this.isPrintButtonDisabled = !selected;
    for (const kitRequest of this.kitRequests) {
      kitRequest.isSelected = selected;
    }
    if (!selected) {
      this.isPrintButtonDisabled = true;
    }
  }

  allChecked(): void {
    if (this.allSelected) {
      this.setAllCheckboxes(true);
    } else {
      this.setAllCheckboxes(false);
    }
  }

  checkboxChecked(): void {
    this.needsNameLabels = this.kitRequests[0] != null && this.kitRequests[0].nameLabel != null;

    // find first selected to enable print button and check for name label
    // start from the beginning more likely that people select kits at the start of the list
    this.isPrintButtonDisabled = true;
    for (const kitRequest of this.kitRequests) {
      if (kitRequest.isSelected) {
        this.isPrintButtonDisabled = false;
        break;
      }
    }
    // find first unselected to set allSelected to false
    // start from the end more likely that at the end of list are kits not selected
    this.allSelected = true;
    for (let i = this.kitRequests.length - 1; i > 0; i--) {
      if (!this.kitRequests[ i ].isSelected) {
        this.allSelected = false;
        break;
      }
    }
  }

  shiftClick(pos: number, event: any): void {
    if (event.shiftKey) {
      if (pos > this.lastSelectedRow) {
        this.selectRangeStop = pos;
      } else if (this.lastSelectedRow > pos) {
        this.selectRangeStop = this.selectRangeStart;
        this.selectRangeStart = pos;
      }
      // select all in the range
      for (let i = this.selectRangeStart; i < this.selectRangeStop + 1; i++) {
        this.kitRequests[ i ].isSelected = true;
      }
    } else {
      // set ranges for shift select
      this.selectRangeStart = pos;
      this.selectRangeStop = pos;
      this.lastSelectedRow = pos;
    }
  }

  queueToPrint(): boolean {
    return this.shippingPage === this.QUEUE || this.shippingPage === this.ERROR;
  }

  downloadReceivedData(): void {
    let sentColumnName = 'DATE_BBSENT';
    let receivedColumnName = 'DATE_BB_KITREC';
    if (this.kitType.name === 'SALIVA') {
      sentColumnName = 'DATE_SALIVA_SENT';
      receivedColumnName = 'DATE_SALIVA_RECEIVED';
    }
    const fieldNames = [ 'realm', 'DATSTAT_ALTPID', 'shortID', 'mfCode', sentColumnName, receivedColumnName ];
    this.downloadKitList(fieldNames);
  }

  private downloadKitList(fieldNames?: string[]): void {
    const map: { realm: string; participantId: string; shortID: string; mfCode: string; sent: string; received: string }[] = [];

    for (const kitRequest of this.kitRequests) {
      let sentDate: string = null;
      if (kitRequest.scanDate !== 0) {
        sentDate = Utils.getDateFormatted(new Date(kitRequest.scanDate), Utils.DATE_STRING_IN_CVS);
      }
      let receivedDate: string = null;
      if (kitRequest.receiveDate !== 0) {
        receivedDate = Utils.getDateFormatted(new Date(kitRequest.receiveDate), Utils.DATE_STRING_IN_CVS);
      }
      map.push({
        realm: kitRequest.realm,
        participantId: kitRequest.participantId,
        shortID: kitRequest.getID(),
        mfCode: kitRequest.kitLabel,
        sent: sentDate,
        received: receivedDate
      });
    }
    const fields = [ 'realm', 'participantId', 'shortID', 'mfCode', 'sent', 'received' ];
    const date = new Date();
    Utils.createCSV(
      fields,
      map,
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM) + ' Kits ' + this.kitType.name + ' '
      + Utils.getDateFormatted(date, Utils.DATE_STRING_CVS) + Statics.CSV_FILE_EXTENSION
    );
  }

  setKitRequest(kitRequest: KitRequest, modalType: string): void {
    this.kitRequest = kitRequest;
    this.modalType = modalType;
    if (modalType !== this.DEACTIVATED) {
      this.dsmService.rateOfExpressLabel(this.kitRequest.dsmKitRequestId).subscribe({
        next: data => {
          // console.log(`Deactivating kit request received: ${JSON.stringify(data, null, 2)}`);
          if (data != null) {
            this.labelRate = EasypostLabelRate.parse(data);
            this.modal.show();
          } else {
            this.errorMessage = 'Can\'t buy express label!';
          }
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Buying express label\n' + err;
        }
      });
    }
  }

  deactivateKitRequest(): void {
    if (this.kitRequest != null && this.deactivationReason != null) {
      this.loading = true;
      const payload = {
        reason: this.deactivationReason
      };
      // console.log(JSON.stringify(payload));
      this.dsmService.deactivateKitRequest(this.kitRequest.dsmKitRequestId, JSON.stringify(payload)).subscribe({
        next: () => {
          // console.log(`Deactivating kit request received: ${JSON.stringify(data, null, 2)}`);
          if (this.kitType != null) {
            this.loadKitRequestData(this.kitType);
          }
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Deactivating kit request\n' + err;
        }
      });
      this.kitRequest = null;
      this.deactivationReason = null;
      this.modal.hide();
      window.scrollTo(0, 0);
    }
  }

  generateExpressLabel(): void {
    if (this.kitRequest != null) {
      // console.log(JSON.stringify(payload));
      this.allSelected = false;
      this.errorMessage = null;
      this.loading = true;
      this.kitRequests = [];
      this.dsmService.expressLabel(this.kitRequest.dsmKitRequestId).subscribe({
        next: () => {
          // console.log(`Deactivating kit request received: ${JSON.stringify(data, null, 2)}`);
          if (this.kitType != null) {
            this.loadKitRequestData(this.kitType);
          }
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Deactivating kit request\n' + err;
        }
      });
      this.kitRequest = null;
      this.deactivationReason = null;
      this.modal.hide();
      window.scrollTo(0, 0);

    }
  }

  activateKitRequest(kitRequest: KitRequest, activate: boolean): void {
    if (kitRequest == null && this.tmpKitRequest != null) {
      kitRequest = this.tmpKitRequest;
      this.modal.hide();
    }
    if (kitRequest != null) {
      this.dsmService.activateKitRequest(kitRequest.dsmKitRequestId, activate).subscribe({
        next: data => {
          // console.log(`Deactivating kit request received: ${JSON.stringify(data, null, 2)}`);
          const result = Result.parse(data);
          if (result.code === 200) {
            if (result.body !== '') {
              this.tmpKitRequest = kitRequest;
              this.alertText = result.body;
              this.modalType = this.ACTIVATED;
              this.modal.show();
            } else {
              if (this.kitType != null) {
                this.loadKitRequestData(this.kitType);
              }
            }
          } else {
            this.additionalMessage = 'Error - Activating kit request.\nPlease contact your DSM developer';
          }
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Activating kit request.\nPlease contact your DSM developer';
        }
      });
    }
  }

  closedNameModal(): void {
    this.modalType = this.DEACTIVATED;
    this.tmpKitRequest = null;
  }

  showNameModal(): void {
    this.modalType = this.NAME_LABELS;
  }

  allSentChecked(): void {
    if (this.allSentSelected) {
      this.setAllSentCheckboxes(true);
    } else {
      this.setAllSentCheckboxes(false);
    }
  }

  sentCheckboxChecked(): void {
    this.isSentButtonDisabled = true;
    this.allSentSelected = true;

    for (const kitRequest of this.kitRequests) {
      if (kitRequest.setSent) {
        this.isSentButtonDisabled = false;
      } else {
        this.allSentSelected = false;
      }
    }
  }

  private setAllSentCheckboxes(selected: boolean): void {
    for (const kitRequest of this.kitRequests) {
      kitRequest.setSent = selected;
      this.isSentButtonDisabled = !selected;
    }
    if (!selected) {
      this.isSentButtonDisabled = true;
    }
  }

  setKitSent(): void {
    const map: { kit: string } [] = [];
    for (const kitRequest of this.kitRequests) {
      if (kitRequest.setSent) {
        map.push({kit: kitRequest.ddpLabel});
      }
    }
    this.dsmService.setKitSentRequest(JSON.stringify(map)).subscribe({
      next: () => {
        // console.log(`Deactivating kit request received: ${JSON.stringify(data, null, 2)}`);
        if (this.kitType != null) {
          this.loadKitRequestData(this.kitType);
        }
        this.loading = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loading = false;
        this.errorMessage = 'Error - Deactivating kit request\n' + err;
      }
    });
  }

  public getTopMargin(): string {
    if (this.selectedSetting != null) {
      return this.selectedSetting.topMargin + 'in';
    }
  }

  public getMarginBetweenTopBottom(): string {
    if (this.selectedSetting != null && this.selectedSetting.labelOnPage > 1) {
      const letter = 11;
      const space = letter - this.selectedSetting.topMargin -
        (this.selectedSetting.labelHeight * (this.selectedSetting.labelOnPage / 2))
        - this.selectedSetting.bottomMargin;
      return space + 'in';
    }
  }

  public getBottomMargin(): string {
    if (this.selectedSetting != null) {
      return this.selectedSetting.bottomMargin + 'in';
    }
  }

  public getLabelHeight(): string {
    if (this.selectedSetting != null) {
      return this.selectedSetting.labelHeight + 'in';
    }
  }

  triggerLabelCreation(): void {
    this.loading = true;
    const cleanedKits: Array<KitRequest> = KitRequest.removeUnselectedKitRequests(this.kitRequests);
    this.dsmService.singleKitLabel(JSON.stringify(cleanedKits)).subscribe({
      next: data => {
        const result = Result.parse(data);
        if (result.code === 200) {
          this.additionalMessage = 'Triggered label creation';
          this.errorMessage = null;
          this.loadKitRequestData(this.kitType);
        }
        this.loading = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loading = false;
        this.errorMessage = 'Error - Loading ddp information ' + err;
      }
    });
  }

  reload(): void {
    this.loadKitRequestData(this.kitType);
  }

  realm(): string {
    return localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }

  getUtil(): Utils {
    return this.util;
  }

  getLanguage(): Language {
    return this.language;
  }

  showPreferredLanguage(): boolean {
    if (this.kitRequests != null) {
      const foundPreferredLanguage = this.kitRequests.find(kitRequest =>
        kitRequest.preferredLanguage != null && kitRequest.preferredLanguage !== ''
      );
      if (foundPreferredLanguage != null) {
        return true;
      }
    }
    return false;
  }
}
