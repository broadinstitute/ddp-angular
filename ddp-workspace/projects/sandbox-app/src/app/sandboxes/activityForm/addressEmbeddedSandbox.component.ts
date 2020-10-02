import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AddressEmbeddedComponent, AddressService, CompositeDisposable, UserActivityServiceAgent } from 'ddp-sdk';
import { BehaviorSubject, empty } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as _ from 'underscore';
import { MailAddressBlock, LoggingService } from 'ddp-sdk';

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
  private anchor: CompositeDisposable;
  public block: MailAddressBlock;


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
        this.logger.logEvent('AddressEmbeddedSandboxComponent', `Got an activityIntanceGuid: ${this.activityInstanceGuid}`);
      } else {
        this.logger.logEvent('AddressEmbeddedSandboxComponent', 'Could not find and activity');
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
      () => this.logger.logEvent('AddressEmbeddedSandboxComponent', 'Temp address deleted'));
    this.anchor.addNew(del);
  }

  public toggleReadOnly() {
    this.isReadOnly = !(this.isReadOnly);
    this.logger.logEvent('AddressEmbeddedSandboxComponent', `Readonly has been toggled to : ${this.isReadOnly}`);
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
          return empty();
        }
      })).subscribe(() => this.logger.logEvent('AddressEmbeddedSandboxComponent', 'Address was deleted'));
    this.anchor.addNew(address);
  }
}
