import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AddressEmbeddedComponent } from './addressEmbedded.component';
import { AddressInputComponent } from './addressInput.component';
import { ValidationMessage } from '../validationMessage.component';
import { MatCardModule, MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AddressVerificationStatus } from '../../models/addressVerificationStatus';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { ActivityResponse } from '../../models/activity/activityResponse';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AddressError } from '../../models/addressError';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';

@Component({
  selector: 'ddp-address-input',
  template: `
    <div></div>`
})
class FakeAddressInputComponent {
  @Output()valueChanged = new EventEmitter();
  @Input()address;
  @Input()readonly;
  @Input()addressErrors;
  ais = {currentAddress$: new Subject<Address>()};
  public clearVerificationErrors(): void {
    console.log('verifications cleared!');
  }
}

describe('AddressEmbeddedComponent', () => {
  let component: AddressEmbeddedComponent;
  let fixture: ComponentFixture<AddressEmbeddedComponent>;
  let childComponentFixture: DebugElement; // : ComponentFixture<FakeAddressInputComponent>;
  let childComponent: FakeAddressInputComponent;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  const submitAnnounceService = new SubmitAnnouncementService();


  beforeEach(async(() => {
    addressServiceSpy = jasmine.createSpyObj('AddressService',
      ['verifyAddress', 'findDefaultAddress', 'getTempAddress', 'saveTempAddress', 'saveAddress']);
    addressServiceSpy.findDefaultAddress.and.returnValue(of(null));
    addressServiceSpy.getTempAddress.and.returnValue(of(null));
    addressServiceSpy.saveTempAddress.and.returnValue(of(null));
    addressServiceSpy.saveAddress.and.callFake((val) => {
      if (val && val instanceof Address) {
        val.guid = '34234';
        return of(val);
      } else {
        return of(null);
      }
    });

    TestBed.configureTestingModule({
      declarations: [ AddressEmbeddedComponent, FakeAddressInputComponent, ValidationMessage ],
      providers: [
        {provide: AddressService, useValue: addressServiceSpy},
        {provide: SubmitAnnouncementService, useValue: submitAnnounceService}
      ],
      imports: [MatCardModule, MatRadioModule, ReactiveFormsModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(AddressEmbeddedComponent);
    component = fixture.componentInstance;
    component.addressInputComponent =
      TestBed.createComponent(FakeAddressInputComponent).componentInstance as unknown as AddressInputComponent;
    const addressBlock = new MailAddressBlock(1);
    addressBlock.titleText = 'The title text';
    addressBlock.subtitleText = 'The subtitle';
    component.block = addressBlock;
    childComponentFixture = fixture.debugElement.query(By.directive(FakeAddressInputComponent));
    childComponent  = childComponentFixture.componentInstance as FakeAddressInputComponent;
  }));

  beforeEach(() => {
    // skip for now;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('ensure try to read default and not temp address at startup', () => {
    fixture.detectChanges();
    // this call should return null
    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalled();
    // Since no guid, no try to call temp address
    expect(addressServiceSpy.getTempAddress).not.toHaveBeenCalled();
  });

  it('ensure try to read default and and temp address at startup', () => {
    // this call should return null
    component.activityGuid = '123';
    fixture.detectChanges();
    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalled();
    // Since no guid, no try to call temp address
    fixture.detectChanges();
    expect(addressServiceSpy.getTempAddress).toHaveBeenCalled();
  });

  it('ensure temp address is loaded into input component', () => {
    // this call should return null
    component.activityGuid = '123';
    // Since no guid, no try to call temp address
    const tempAddress = new Address();
    addressServiceSpy.getTempAddress.and.returnValue(of(tempAddress));
    fixture.detectChanges();
    expect(addressServiceSpy.getTempAddress).toHaveBeenCalled();
    const componentInstance = childComponentFixture.componentInstance;
    expect(componentInstance instanceof FakeAddressInputComponent);
    expect((componentInstance as FakeAddressInputComponent).address === tempAddress);
  });

  it('ensure handling of PERFECT new address', () => {
      component.activityGuid = '123';
      const perfectAddress = buildPerfectAddress();
      addressServiceSpy.verifyAddress.and.returnValue(of(clone(perfectAddress)));
      fixture.detectChanges();

      childComponent.valueChanged.emit(perfectAddress);
      fixture.detectChanges();
      expect(addressServiceSpy.verifyAddress).toHaveBeenCalled();
      expect(addressServiceSpy.saveTempAddress).toHaveBeenCalled();
      expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
      // we should not call save unless we have an address with a guid
      expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();
      const suggestionMatCard = fixture.debugElement.query(By.css('#suggestionMatCard'));
      expect(suggestionMatCard).toBeNull();
      const errorComponent = fixture.debugElement.query(By.directive(ValidationMessage));
      expect(errorComponent).toBeNull();
      // check that we are not feeding address back to input component
      expect(childComponent.address).toBeFalsy();
  });

  it('check suggestion shown', () => {
    emitAddressThatTriggersSuggestion();
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
    // we should not call save unless we have an address with a guid
    expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();
    const suggestionMatCard = fixture.debugElement.query(By.css('#suggestionMatCard'));
    expect(suggestionMatCard).not.toBeNull();
    const errorComponent = findValidationMessageDebug(fixture);
    expect(errorComponent).toBeNull();
    // check that we are not feeding address back to input component
    expect(childComponent.address).toBeFalsy();

    const radioGroupComponentDebug = findRadioGroupDebug(fixture);
    const groupInstance: MatRadioGroup = radioGroupComponentDebug.injector.get<MatRadioGroup>(MatRadioGroup);
    expect(groupInstance.value).toBe('original');
  });

  it ('test suggestion selection changes address and saves temp address and updates child component', () => {
    const addresses = emitAddressThatTriggersSuggestion();
    component.activityGuid = '123';
    const radioGroupComponentDebug = fixture.debugElement.query(By.directive(MatRadioGroup));
    const radioDebugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatRadioButton));
    const radioInstances = radioDebugElements.map(debugEl => debugEl.componentInstance) as MatRadioButton[];
    const groupInstance: MatRadioGroup = radioGroupComponentDebug.injector.get<MatRadioGroup>(MatRadioGroup);
    fixture.detectChanges();
    expect(groupInstance.selected.value).toBe('original');
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addresses.enteredAddress, '123');

    // selected the suggestion
    // Can't figure out how to select suggest from HTML element, so setting from formgroup.
    component.suggestionForm.get('suggestionRadioGroup').patchValue('suggested');
    // Leaving this here just to keep track of what things don't work
    // radioDebugElements.filter(radio => radio.nativeElement.value === 'suggested').forEach(radio => {
    //   radio.focus();
    //   radio.triggerEventHandler('click', {});
    // });
    // radioInstances.filter(radio => radio.value === 'suggested').map(radio => radio._inputElement.nativeElement).forEach(radio => {
    //   radio.focus();
    //   radio.checked = true;
    //   tick(10);
    // });
    // radioInstances.filter(radio => radio.value === 'suggested').forEach(radio => {
    //   radio.focus();
    //   radio.checked = true;
    //   dispatchEvent(radio._inputElement.nativeElement, 'click');
    // });
    fixture.detectChanges();
    expect(groupInstance.value).toBe('suggested');
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addresses.suggestedAddress, '123');

    // click on the entered option
    component.suggestionForm.get('suggestionRadioGroup').patchValue('entered');
    fixture.detectChanges();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addresses.enteredAddress, '123');
    expect(childComponent.address).toEqual(addresses.enteredAddress);

    // click again on suggested
    component.suggestionForm.get('suggestionRadioGroup').patchValue('suggested');
    fixture.detectChanges();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addresses.suggestedAddress, '123');
    expect(childComponent.address).toEqual(addresses.suggestedAddress);

    // setting address from child to a "perfect" address after selecting a suggested address
    const incomingPerfectAddress = buildPerfectAddress();
    incomingPerfectAddress.name = 'SOME OTHER NAME';
    addressServiceSpy.verifyAddress.and.returnValue(of(incomingPerfectAddress));
    childComponent.valueChanged.emit(incomingPerfectAddress);
    fixture.detectChanges();

    // suggestion box gone?
    const suggestionMatCard = fixture.debugElement.query(By.css('#suggestionMatCard'));
    expect(suggestionMatCard).toBeNull();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(incomingPerfectAddress, '123');

    // after all that. We never called save "real" address
    expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();

  });

  it ('test global address error from EasyPost', () => {
    component.activityGuid = '123';
    const validationMessageBefore = findValidationMessageDebug(fixture);
    expect(validationMessageBefore).toBeNull();
    const addressToEnter = buildPerfectAddress();
    addressToEnter.street2 = 'NO PLACE THAT IS GOOD';
    // field 'address' is the global error.
    const overallAddressErrors: AddressError[] = [{code: '123', field: 'address', message: 'Bad address'}];
    const verificationStatus: AddressVerificationStatus = {
      address : new Address(),
      isDeliverable: false,
      code: 'BAD!',
      errors: overallAddressErrors};
    addressServiceSpy.verifyAddress.and.returnValue(throwError(verificationStatus));
    fixture.detectChanges();

    childComponent.valueChanged.emit(addressToEnter);
    fixture.detectChanges();
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalledWith(addressToEnter);
    const validationMessageAfter = findValidationMessageDebug(fixture);
    expect(validationMessageAfter).not.toBeNull();
    expect(childComponent.addressErrors).toEqual([]);
    // we save temp address even if it has errors
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addressToEnter, '123');
  });

  it ('test field level error from EasyPost', () => {
    component.activityGuid = '123';
    const validationMessageBefore = findValidationMessageDebug(fixture);
    expect(validationMessageBefore).toBeNull();
    const addressToEnter = buildPerfectAddress();
    addressToEnter.street2 = 'NO PLACE THAT IS GOOD';
    // field 'address' is the global error.
    const overallAddressErrors: AddressError[] = [{code: '123', field: 'street1', message: 'Bad street1!!'}];
    const verificationStatus: AddressVerificationStatus = {
      address : new Address(),
      isDeliverable: false,
      code: 'REALLYBAD!',
      errors: overallAddressErrors};
    addressServiceSpy.verifyAddress.and.returnValue(throwError(verificationStatus));
    fixture.detectChanges();

    childComponent.valueChanged.emit(addressToEnter);
    fixture.detectChanges();
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalledWith(addressToEnter);
    const validationMessageAfter = findValidationMessageDebug(fixture);
    expect(validationMessageAfter).toBeNull();
    expect(childComponent.addressErrors).toEqual(overallAddressErrors);
    // we save temp address even if it has errors
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addressToEnter, '123');
  });

  it('test readonly input', () => {
    component.readonly = true;
    fixture.detectChanges();
    expect(childComponent.readonly).toBe(true);
    component.readonly = false;
    fixture.detectChanges();
    expect(childComponent.readonly).toBe(false);
  });
  it('test loading default address', fakeAsync(() => {
    const defaultAddress = buildPerfectAddress();
    defaultAddress.guid = '789';
    component.activityGuid = '123';

    // we are going to try call save in a tick or two
    const spyOnSubmitAnnounced = spyOnProperty(submitAnnounceService, 'submitAnnounced$', 'get');
    spyOnSubmitAnnounced.and.returnValue(hot('--a', {a: (new ActivityResponse('blah'))}));
    // @ts-ignore
    addressServiceSpy.findDefaultAddress.and.returnValue(of(defaultAddress));
    let componentIsBusy = false;
    component.componentBusy.subscribe(isBusy => componentIsBusy = isBusy);
    fixture.detectChanges();
    expect(childComponent.address).toBe(defaultAddress);
    expect(addressServiceSpy.getTempAddress).not.toHaveBeenCalled();
    expect(addressServiceSpy.verifyAddress).not.toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).not.toHaveBeenCalled();
    expect(findValidationMessageDebug(fixture)).toBeNull();
    expect(findRadioGroupDebug(fixture)).toBeNull();
    getTestScheduler().flush();
    tick();
    fixture.detectChanges();
    expect(addressServiceSpy.saveAddress).toHaveBeenCalledWith(defaultAddress, false);
    // check for bug where we not setting busy flag back to false if no temp address loaded
    expect(componentIsBusy).toBe(false);
  }));
  it('test component busy output', fakeAsync(() => {
    component.activityGuid = '123';
    const perfectAddress = buildPerfectAddress();
    addressServiceSpy.verifyAddress.and.callFake(() => cold('a', {a: buildPerfectAddress()}));
    addressServiceSpy.saveTempAddress.and.callFake(() => cold('-a', {a: true}));
    fixture.detectChanges();

    const busySpy = jasmine.createSpy(`busySpy`);
    component.componentBusy.subscribe(busySpy);
    expect(busySpy).not.toHaveBeenCalled();
    component.componentBusy.subscribe((busy) => console.log('got called with:' + busy));
    childComponent.valueChanged.emit(perfectAddress);
    getTestScheduler().flush();
    tick();
    fixture.detectChanges();
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalled();

    expect(busySpy).toHaveBeenCalled();
    // will be busy at first
    expect(busySpy).toHaveBeenCalledWith(true);
    // wont be busy after perfect address emitted from verify address
    expect(busySpy).toHaveBeenCalledWith(false);
  }));

  const emitAddressThatTriggersSuggestion = () => {
    component.activityGuid = '123';
    // suggestion will differ from entered address
    const enteredAddress = buildPerfectAddress();
    enteredAddress.street1 = '75 AMES STREET';

    addressServiceSpy.verifyAddress.and.returnValue(of(buildPerfectAddress()));
    fixture.detectChanges();

    childComponent.valueChanged.emit(enteredAddress);
    fixture.detectChanges();
    return {enteredAddress, suggestedAddress: buildPerfectAddress()};
  };

});
const findValidationMessageDebug = (fixture): DebugElement =>
  fixture.debugElement.query(By.directive(ValidationMessage));


const findRadioGroupDebug = (fixture): DebugElement =>
  fixture.debugElement.query(By.directive(MatRadioGroup));

// some test support utils
const clone = (obj) => Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
const buildPerfectAddress = (): Address => {
  const perfectAddress = new Address();
  perfectAddress.name = 'RAPUNZEL';
  perfectAddress.country = 'US';
  perfectAddress.street1 = '75 AMES ST';
  perfectAddress.street2 = '';
  perfectAddress.city = 'CAMBRIDGE';
  perfectAddress.state = 'MA';
  perfectAddress.zip = '02142-1403';
  perfectAddress.phone = '6175555555';
  return perfectAddress;
};

