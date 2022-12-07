import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ScanPairComponent} from '../scan-pair/scan-pair.component';
import {ScanPair, ScanValue} from './scan.model';
import {DSMService} from '../services/dsm.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ScanError} from './error.model';
import {Auth} from '../services/auth.service';
import {Statics} from '../utils/statics';
import {ScanValueComponent} from '../scan-value/scan-value.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
})
export class ScanComponent implements OnInit {
  scanPairs: Array<ScanPairComponent> = [];
  private scanPairsValue: Array<ScanPair> = [];
  private scanErrors: Array<ScanError> = [];

  duplicateDetected = false;

  additionalMessage: string;

  scanTracking = false;
  leftPlaceholder = 'Kit Label';
  rightPlaceholder = 'DSM Label';

  scanReceived = false;
  initialScan = false;
  scanValues: Array<ScanValueComponent> = [];
  private singleScanValues: Array<ScanValue> = [];
  scanErrorMsg = '';

  constructor(private _changeDetectionRef: ChangeDetectorRef, private dsmService: DSMService, private router: Router,
              private auth: Auth, private route: ActivatedRoute) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe(params => {
      this.scanTracking = params[DSMService.SCAN_TRACKING] || false;
      this.scanReceived = params[DSMService.SCAN_RECEIVED] || false;
      this.initialScan = params[DSMService.INITIAL_SCAN] || false;
      this.changePlaceholder();
      this.createNewComponents();
      this.additionalMessage = null;
    });
  }

  private changePlaceholder(): void {
    if (this.scanTracking) {
      this.leftPlaceholder = 'Tracking Label';
      this.rightPlaceholder = 'Kit Label';
    } else if (this.scanReceived) {
      this.leftPlaceholder = 'SM-ID';
    } else {
      this.leftPlaceholder = 'Kit Label';
      this.rightPlaceholder = 'DSM Label';
      if (this.initialScan) {
        this.rightPlaceholder = 'Short ID';
      }
    }
  }

  public scanDone(arg): void { // arg[0] = leftvalue (ddpLabel), arg[1] = rightvalue (kitLabel) and arg[2] = position
    this.makeScanErrorMsg();
    this.scanPairsValue[arg[2]].leftValue = arg[0];
    this.scanPairsValue[arg[2]].rightValue= arg[1];
    if(this.shouldAddNewPair(arg[2])) {
      this.addNewScanPair();
    }
    this._changeDetectionRef.detectChanges();
  }

  public get displayScanText(): string {
    if (!this.scanTracking && !this.scanReceived) {
      if (this.initialScan) {
        return 'Initial Scan';
      }
      return 'Final Scan';
    } else if (this.scanTracking) {
      return 'Tracking Scan';
    } else if (this.scanReceived) {
      return 'Receiving Scan';
    }
  }

  private shouldAddNewPair(position: number): boolean {
    if(this.scanPairs.length === position + 1) {
      return true;
    }
    return false;
  }

  public validateRightValue(position: number): boolean {
    if (this.scanPairsValue.length > 0 && this.scanPairsValue[position] != null) {
      return this.validateValue(this.scanPairsValue[position].rightValue, position, false);
    }
    return false;
  }

  public validateLeftValue(position: number): boolean {
    if (this.scanPairsValue.length > 0 && this.scanPairsValue[position] != null) {
      return this.validateValue(this.scanPairsValue[position].leftValue, position, true);
    }
    return false;
  }

  private validateValue(labelValue: string, position: number, isLeft: boolean): boolean {
    let isDuplicate = false;
    if(labelValue !== '') {
      for (let i = 0; i < this.scanPairsValue.length; i++) {
        if (i !== position) {
          if (this.scanPairsValue[position].leftValue != null && labelValue === this.scanPairsValue[i].leftValue
            || this.scanPairsValue[position].rightValue != null && labelValue === this.scanPairsValue[i].rightValue) {
            isDuplicate = true;
          }
        } else {
          if (isLeft) {
            if (this.scanPairsValue[position].rightValue != null && labelValue === this.scanPairsValue[i].rightValue) {
              isDuplicate = true;
            }
          } else {
            if (this.scanPairsValue[position].leftValue != null && labelValue === this.scanPairsValue[i].leftValue) {
              isDuplicate = true;
            }
          }
        }
      }
    }
    return isDuplicate;
  }

  public removeScanPair(position: number): void {
    this.scanPairs.splice(position, 1);
    this.scanPairsValue.splice(position, 1);
  }

  private addNewScanPair(): void {
    const newRow = new ScanPairComponent();
    this.scanPairs.push(newRow);
    this.scanPairsValue.push(new ScanPair('', ''));
  }

  ngOnInit(): void {
    this.additionalMessage = null;
    this.createNewComponents();
  }

  createNewComponents(): void {
    this.scanPairsValue = [];
    this.scanPairs = [];
    this.scanValues = [];
    this.singleScanValues = [];
    if (this.scanTracking) {
      this.addNewScanPair();
      if (this.scanPairs.length < 1) {
        const newScanPair = new ScanPairComponent();
        this.scanPairs.push(newScanPair);
        this.scanPairsValue.push(new ScanPair('', ''));
      }
    } else if (this.scanReceived) {
      this.addNewSingleScan();
      if (this.scanValues.length < 1) {
        const newScanValue = new ScanValueComponent();
        this.scanValues.push(newScanValue);
      }
    } else {
      this.addNewScanPair();
      if (this.scanPairs.length < 1) {
        const newScanPair = new ScanPairComponent();
        this.scanPairs.push(newScanPair);
      }
    }
  }

  public savePairs(): void {
    if (this.scanPairsValue.length > 0) {
      this.duplicateDetected = false;
      for (let i = 0; i < this.scanPairsValue.length - 1; i++) {
        if (this.validateValue(this.scanPairsValue[i].leftValue, i, true)) {
          this.duplicateDetected = true;
          break;
        }
        if (this.validateValue(this.scanPairsValue[i].rightValue, i, false)) {
          this.duplicateDetected = true;
          break;
        }
      }

      if (!this.duplicateDetected) {
        let jsonData: any[];
        this.scanErrors = [];
        const json = JSON.stringify(this.scanPairsValue);
        if (this.scanTracking) {
          const scanPayloads = [];
          this.scanPairsValue.forEach(element => {
            if(element.rightValue !== '' && element.leftValue !== '') {
            scanPayloads.push({
              kitLabel: element.rightValue,
              trackingReturnId: element.leftValue
            })};
          });
          this.dsmService.trackingScan(JSON.stringify(scanPayloads))
            .subscribe({
              next: data => {
                jsonData = this.onSuccess(jsonData, data);
              },
              error: err => {
                this.onError(err);
              }
            });
        } else if (this.initialScan) {
          const scanPayloads = [];
          this.scanPairsValue.forEach(element => {
            if(element.rightValue !== '' && element.leftValue !== '') {
            scanPayloads.push({
              kitLabel: element.rightValue,
              trackingReturnId: element.leftValue
            })};
          });
          this.dsmService.initialScan(JSON.stringify(scanPayloads))
            .subscribe({
              next: data => {
                jsonData = this.onSuccess(jsonData, data);
              },
              error: err => {
                this.onError(err);
              }
            });
        } else {
          const scanPayloads = [];
          this.scanPairsValue.forEach(element => {
            if(element.rightValue !== '' && element.leftValue !== '') {
            scanPayloads.push({
              kitLabel: element.rightValue,
              trackingReturnId: element.leftValue
            })};
          });
          this.dsmService.finalScan(JSON.stringify(scanPayloads))
            .subscribe({
              next: data => {
                jsonData = this.onSuccess(jsonData, data);
              },
              error: err => {
                this.onError(err);
              }
            });
        }
      }
    }
  }

  private onError(err: any): void {
    if (err._body === Auth.AUTHENTICATION_ERROR) {
      this.router.navigate([Statics.HOME_URL]);
    }
    this.additionalMessage = 'Error - Failed to save data';
  }

  private onSuccess(jsonData: any[], data: any): any {
    let failedSending = false;
    jsonData = data;
    jsonData.forEach((val) => {
      this.scanErrors.push(ScanError.parse(val));
      failedSending = true;
    });
    if (failedSending) {
      this.removeSuccessfulScans();
      this.additionalMessage = 'Error - Failed to save all changes';
      if (this.scanErrors.length === 1 && this.scanErrors[0].kit === this.scanErrors[0].error) {
        //pe-cgs the error and kit would be the hruid and only 1 kit will be scanned at a time
        this.scanPairsValue = [];
        this.scanPairs = [];
        this.addNewScanPair();
        this.additionalMessage = 'Data saved for ' + this.scanErrors[0].kit;
      }
    } else {
      this.scanPairsValue = [];
      this.scanPairs = [];
      this.addNewScanPair();
      this.additionalMessage = 'Data saved';
    }
    return jsonData;
  }

  private removeSuccessfulScans(): void {
    for (let i = this.scanPairsValue.length - 1; i >= 0; i--) {
      let found = false;
      for (let j = this.scanErrors.length - 1; j >= 0; j--) {
        if (this.scanPairsValue[i].rightValue === this.scanErrors[j].kit) {
          found = true;
        }
      }
      if (!found) {
        this.scanPairs.splice(i, 1);
        this.scanPairsValue.splice(i, 1);
      }
    }
  }

  private removeSuccessfulSingleScans(): void {
    for (let i = this.singleScanValues.length - 1; i >= 0; i--) {
      let found = false;
      for (let j = this.scanErrors.length - 1; j >= 0; j--) {
        if (this.singleScanValues[i].kit === this.scanErrors[j].kit) {
          found = true;
        }
      }
      if (!found) {
        this.scanValues.splice(i, 1);
        this.singleScanValues.splice(i, 1);
      }
    }
  }

  public checkSendStatus(position: number): boolean {
    if (
      this.scanPairsValue.length > 0 && this.scanPairsValue[position] != null
      && this.scanPairsValue[position].rightValue != null
      && this.scanErrors.length > 0
    ) {
      for (const scanError of this.scanErrors) {
        if (this.scanPairsValue[position].rightValue === scanError.kit) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  public setLeftValue(arg): void { // arg[0] = dsmValue and arg[1] = position
    if (arg.length === 2) {
      if (arg[1] < this.scanPairsValue.length) {
        this.scanPairsValue[arg[1]].leftValue = arg[0];
      }
    }
  }

  public singleValueScanDone(arg): void { // arg[0] = singleValue (SM-ID) and arg[1] = position
    if (arg.length === 2) {
      if (!this.checkIfSingleValueChanged(arg[0], arg[1])) {
        this.singleScanValues.push(new ScanValue(arg[0]));
        this.addNewSingleScan();
        this._changeDetectionRef.detectChanges();
      }
    }
  }

  private checkIfSingleValueChanged(value: string, position: number): boolean {
    for (let i = 0; i < this.singleScanValues.length; i++) {
      if (this.singleScanValues[i].kit === value && i === position) {
        return true;
      }
    }
    return false;
  }

  private addNewSingleScan(): void {
    const newRow = new ScanValueComponent();
    this.scanValues.push(newRow);
  }

  public removeScanValue(position: number): void {
    this.scanValues.splice(position, 1);
    this.singleScanValues.splice(position, 1);
  }

  validateSingleScan(position: number): boolean {
    let isDuplicate = false;
    for (let i = 0; i < this.singleScanValues.length - 1; i++) {
      if (i !== position) {
        if (this.singleScanValues[position] != null && this.singleScanValues[i] != null
          && this.singleScanValues[position].kit != null && this.singleScanValues[i].kit != null
          && this.singleScanValues[position].kit === this.singleScanValues[i].kit) {
          isDuplicate = true;
        }
      }
    }
    return isDuplicate;
  }

  public checkSingleScanSendStatus(position: number): boolean {
    if (this.singleScanValues.length > 0 && this.singleScanValues[position] != null
      && this.singleScanValues[position].kit != null
      && this.scanErrors.length > 0) {
      for (const scanError of this.scanErrors) {
        if (this.singleScanValues[position].kit === scanError.kit) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  public saveValues(): void {
    if (this.singleScanValues.length > 0) {
      this.duplicateDetected = false;
      for (let i = 0; i < this.singleScanValues.length; i++) {
        if (this.validateSingleScan(i)) {
          this.duplicateDetected = true;
          break;
        }
      }

      if (!this.duplicateDetected) {
        let jsonData: any[];
        this.scanErrors = [];
        this.dsmService.setKitReceivedRequest(JSON.stringify(this.singleScanValues))
          .subscribe({ // need to subscribe, otherwise it will not send!
            next: data => {
              let failedSending = false;
              jsonData = data;
              jsonData.forEach((val) => {
                this.scanErrors.push(ScanError.parse(val));
                failedSending = true;
              });
              if (failedSending) {
                this.removeSuccessfulSingleScans();
                this.additionalMessage = 'Error - Failed to save all changes';
              } else {
                this.scanValues = [];
                this.singleScanValues = [];
                this.addNewSingleScan();
                this.additionalMessage = 'Data saved';
              }
            },
            error: err => {
              if (err._body === Auth.AUTHENTICATION_ERROR) {
                this.router.navigate([Statics.HOME_URL]);
              }
              this.additionalMessage = 'Error - Failed to save data';
            }
          });
      }
    }
  }

  public getError(position: number): string {
    for (let j = this.scanErrors.length - 1; j >= 0; j--) {
      if (this.scanPairsValue[position] != null && this.scanPairsValue[position].rightValue === this.scanErrors[j].kit) {
        return this.scanErrors[j].error;
      }
    }
    return null;
  }

  public getSingleError(position: number): string {
    for (let j = this.scanErrors.length - 1; j >= 0; j--) {
      if (this.singleScanValues[position] != null && this.singleScanValues[position].kit === this.scanErrors[j].kit) {
        return this.scanErrors[j].error;
      }
    }
    return null;
  }

  public areScanPairsValid(): boolean {
    if(!this.initialScan)
    {
      return this.scanPairs.length < 2;
    }

    //No valid pair has been made yet, so we want a disabled button
    if(this.scanPairs.length === 1) {
      return true;
    }
    for (const {leftValue, rightValue} of this.scanPairsValue) {
      //If both are null I want the button to be enabled, so return false
      if(rightValue === '' && leftValue === '') {
        return false;
      }

      //If only one of the two is null, I want the button to be enabled
      if(leftValue === '') {
          return true;
      }
      if(rightValue === '' || rightValue.length !== 6) {
        return true;
      }
    }
    return false;
  }

  public makeScanErrorMsg(): void {

    this.scanErrorMsg = '';

    for (const {leftValue, rightValue} of this.scanPairsValue) {

      if(rightValue === '' && leftValue === '') {
        this.scanErrorMsg = '';
      }

      else if(leftValue === '') {
        this.scanErrorMsg = 'Kit Label cannot be blank';
      }

      else if(rightValue === '' || rightValue.length !== 6) {
        this.scanErrorMsg = 'ShortID must be 6 characters long';
      }
    }
  }
}
