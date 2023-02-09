import {Injectable} from '@angular/core';
import {Scanners} from '../interfaces/scanners';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DSMService} from '../../services/dsm.service';
import {Observable} from 'rxjs';

@Injectable()
export class ScannerService {
  private readonly scanners: Scanners = {
    initial: {
      title: 'Initial Scan',
      buttonValue: 'Save Scan Pairs',
      saveFn: (data: object) =>  this.saveInitialScan(data),
      inputFields: [
        {
          controllerName: 'kitLabel',
          placeholder: 'Kit Label',
          maxLength: undefined,
          validators: []
        },
        {
          controllerName: 'hruid',
          placeholder: 'Short ID',
          maxLength: 6,
          validators: [this.sixCharacters()]
        }
      ]
    },
    tracking: {
      title: 'Tracking Scan',
      buttonValue: 'Save Scan Pairs',
      saveFn: (data: object) =>  this.saveTrackingScan(data),
      inputFields: [
        {
          controllerName: 'trackingReturnId',
          placeholder: 'Tracking Label',
          maxLength: undefined,
          validators: []
        },
        {
          controllerName: 'kitLabel',
          placeholder: 'Kit Label',
          maxLength: undefined,
          validators: []
        }
      ]
    },
    final: {
      title: 'Final Scan',
      buttonValue: 'Save Scan Pairs',
      saveFn: (data: object) =>  this.saveFinalScan(data),
      inputFields: [
        {
          controllerName: 'kitLabel',
          placeholder: 'Kit Label',
          maxLength: undefined,
          validators: []
        },
        {
          controllerName: 'ddpLabel',
          placeholder: 'DSM Label',
          maxLength: undefined,
          validators: []
        }
      ]
    },
    RGPFinal: {
      title: 'RGP Final Scan',
      buttonValue: 'Save Scan Pairs',
      saveFn: (data) => this.saveRGPFinalScan(data) ,
      inputFields: [
        {
          controllerName: 'kitLabel',
          placeholder: 'Kit Label',
          maxLength: undefined,
          validators: []
        },
        {
          controllerName: 'ddpLabel',
          placeholder: 'DSM Label',
          maxLength: undefined,
          validators: []
        },
        {
          controllerName: 'RNA',
          placeholder: 'RNA',
          maxLength: undefined,
          validators: [this.shouldIncludeRNA()]
        }
      ]
    },
    receiving: {
      title: 'Receiving Scan',
      buttonValue: 'Save SM-IDs',
      saveFn: (data: object) => this.saveReceivingScan(data),
      inputFields: [
        {
          controllerName: 'kit',
          placeholder: 'SM-ID',
          maxLength: undefined,
          validators: []
        }
      ]
    }
  };

  constructor(private readonly dsmService: DSMService) {
  }

  public getScanner(scannerName: string): any {
    return this.scanners[scannerName];
  }

  public save(scanType: string, data: object): Observable<any> {
    return this.scanners[scanType].saveFn(data);
  }

  /* HTTP Requests */
  private saveTrackingScan(data: object): Observable<any> {
    return this.dsmService.trackingScan(JSON.stringify(data));
  }

  private saveInitialScan(data: object): Observable<any> {
    return this.dsmService.initialScan(JSON.stringify(data));
  }

  private saveFinalScan(data: object): Observable<any> {
    return this.dsmService.finalScan(JSON.stringify(data));
  }

  private saveRGPFinalScan(data: object): Observable<any> {
    return this.dsmService.finalScan(JSON.stringify(data));
  }

  private saveReceivingScan(data: object): Observable<any> {
    return this.dsmService.setKitReceivedRequest(JSON.stringify(data));
  }

  /* Custom Validators */
  private sixCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      control?.value?.length !== 6  || !control?.value?.length? {notSixCharacters: true} : null;
  }

  private shouldIncludeRNA(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control?.value?.slice(0, 4).includes('RNA') ? {noRNA: true} : null;
  }
}
