import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserActivityServiceAgent, AddressEmbeddedComponent, AddressService, CompositeDisposable } from 'ddp-sdk';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import * as _ from 'underscore';

@Component({
  selector: 'app-sandbox-embedded-address',
  templateUrl: 'addressEmbeddedSandbox.component.html'
})
export class AddressEmbeddedSandboxComponent implements OnInit, OnDestroy {
  @ViewChild(AddressEmbeddedComponent, { static: true }) addressComponent: AddressEmbeddedComponent;
  public activityInstanceGuid: string;
  public inputParameters = {};
  private anchor: CompositeDisposable;

  constructor(private activityService: UserActivityServiceAgent,
    private addressService: AddressService) {
    this.anchor = new CompositeDisposable();
  }

  public ngOnInit(): void {
    const get = this.activityService.getActivities(new BehaviorSubject("TESTSTUDY1")).subscribe((result) => {
      if (result && _.isArray(result) && result.length > 0) {
        this.activityInstanceGuid = result[0].instanceGuid;
        console.log("Got an activityIntanceGuid:" + this.activityInstanceGuid);
      } else {
        console.log("Could not find and activity");
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
      () => console.log("temp address deleted"));
    this.anchor.addNew(del);
  }

  public deleteAddress(): void {
    const address = this.addressService.findDefaultAddress().pipe(
      mergeMap((existingAddress) => {
        if (existingAddress) {
          return this.addressService.deleteAddress(existingAddress);
        } else {
          return empty();
        }
      })).subscribe(() => console.log("address was deleted"));
    this.anchor.addNew(address);
  }
}
