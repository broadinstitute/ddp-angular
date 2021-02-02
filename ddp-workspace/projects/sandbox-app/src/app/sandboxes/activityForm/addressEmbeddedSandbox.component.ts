import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AddressEmbeddedComponent,
  AddressService,
  CompositeDisposable,
  UserActivityServiceAgent,
  MailAddressBlock,
  LoggingService
} from 'ddp-sdk';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
  selector: 'app-sandbox-embedded-address',
  templateUrl: 'addressEmbeddedSandbox.component.html'
})
export class AddressEmbeddedSandboxComponent implements OnInit, OnDestroy {
  @ViewChild(AddressEmbeddedComponent, { static: true }) addressComponent: AddressEmbeddedComponent;
  public activityInstanceGuid: string;
  public inputParameters = {};
  public isReadOnly = true;
  public bogusAddress = null;
  public block: MailAddressBlock;
  private anchor: CompositeDisposable;
  private readonly LOG_SOURCE = 'AddressEmbeddedSandboxComponent';

  constructor(
    private logger: LoggingService,
    private activityService: UserActivityServiceAgent,
    private addressService: AddressService) {
    this.anchor = new CompositeDisposable();
    const block = new MailAddressBlock(1);
    block.titleText = 'The Title!!!';
    block.subtitleText = 'The subtitle!!!';
    this.block = block;
  }

  public ngOnInit(): void {
    const get = this.activityService.getActivities(new BehaviorSubject('TESTSTUDY1')).subscribe((result) => {
      if (result && _.isArray(result) && result.length > 0) {
        this.activityInstanceGuid = result[0].instanceGuid;
        this.logger.logEvent(this.LOG_SOURCE, `Got an activityIntanceGuid: ${this.activityInstanceGuid}`);
      } else {
        this.logger.logEvent(this.LOG_SOURCE, 'Could not find and activity');
      }
    });
    this.anchor.addNew(get);
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public saveAddress(): void {
    this.addressComponent.saveAddress();
  }

  public deleteTempAddress(): void {
    const del = this.addressService.deleteTempAddress(this.activityInstanceGuid).subscribe(
      () => this.logger.logEvent(this.LOG_SOURCE, 'Temp address deleted'));
    this.anchor.addNew(del);
  }

  public toggleReadOnly(): void {
    this.isReadOnly = !(this.isReadOnly);
    this.logger.logEvent(this.LOG_SOURCE, `Readonly has been toggled to : ${this.isReadOnly}`);
  }

  public setBogusAddress(): void {
    this.bogusAddress = {
      name: (Math.random() + ''),
      street1: (Math.random() + ''),
      street2: (Math.random() + ''),
      city: (Math.random() + ''),
      state: (Math.random() + ''),
      zip: (Math.random() + ''),
      country: 'US',
      phone: (Math.random() + '')
    };
  }

  public deleteAddress(): void {
    const address = this.addressService.findDefaultAddress().pipe(
      mergeMap((existingAddress) => {
        if (existingAddress) {
          return this.addressService.deleteAddress(existingAddress);
        } else {
          return EMPTY;
        }
      })).subscribe(() => this.logger.logEvent(this.LOG_SOURCE, 'Address was deleted'));
    this.anchor.addNew(address);
  }
}
