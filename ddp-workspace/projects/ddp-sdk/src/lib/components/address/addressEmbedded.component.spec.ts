import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AddressEmbeddedComponent } from './addressEmbedded.component';
import { AddressInputComponent } from './addressInput.component';
import { ValidationMessage } from '../validationMessage.component';
import { MatCardModule } from '@angular/material/card';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
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
import { AddressVerificationResponse } from '../../models/addressVerificationResponse';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { TranslateTestingModule } from '../../testsupport/translateTestingModule';

@Component({
  selector: 'ddp-address-input',
  template: `
    <div>{{ address }}</div>
    <div>{{ addressErrors }}</div>`
})
class FakeAddressInputComponent {
  private _address: Address | null;
  private _readonly = false;
  @Output() valueChanged = new EventEmitter();
  @Input() addressErrors;
  @Input() country;
  @Input()
  set address(val: Address | null) {
    console.log('set address called with: %o', val);
    this._address = val;
  }
  get address(): Address | null {
    return this._address;
  }

  ais = { currentAddress$: new Subject<Address>() };
  public clearVerificationErrors(): void {
    console.log('verifications cleared!');
  }
  @Input()
  set readonly(val: boolean) {
    console.log('set readonly called with: %o', val);
    this._readonly = val;
  }
  get readonly(): boolean {
    return this._readonly;
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
      ['verifyAddress', 'findDefaultAddress', 'getTempAddress', 'saveTempAddress', 'saveAddress', 'deleteTempAddress']);
    addressServiceSpy.findDefaultAddress.and.returnValue(of(null));
    addressServiceSpy.getTempAddress.and.returnValue(of(null));
    addressServiceSpy.saveTempAddress.and.returnValue(of(null));
    addressServiceSpy.deleteTempAddress.and.returnValue(of(null));
    addressServiceSpy.saveAddress.and.callFake((val) => {
      if (val && val instanceof Address) {
        val.guid = '34234';
        return of(val);
      } else {
        return of(null);
      }
    });
    const translateServiceSpy: jasmine.SpyObj<NGXTranslateService> = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
    // @ts-ignore
    translateServiceSpy.getTranslation.and.callFake((word: string | Array<string>, keyToValue?: object) => {
      return of(Array.isArray(word) ?
        word.map((each, i) => ({ each: 'label' + i })).reduce((prev, current) => ({ ...prev, ...current }), {}) as object :
        'label1');
    });

    TestBed.configureTestingModule({
      declarations: [AddressEmbeddedComponent, FakeAddressInputComponent, ValidationMessage],
      providers: [
        { provide: AddressService, useValue: addressServiceSpy },
        { provide: SubmitAnnouncementService, useValue: submitAnnounceService },
        { provide: NGXTranslateService, useValue: translateServiceSpy }
      ],
      imports: [MatCardModule, MatRadioModule, ReactiveFormsModule, TranslateTestingModule]
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
    childComponent = childComponentFixture.componentInstance as FakeAddressInputComponent;
  }));

  beforeEach(() => {
    // skip for now;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(childComponent).toBeTruthy();
  });

  it('ensure try to read default and not temp address at startup when no activity guid', () => {
    fixture.detectChanges();
    // this call should return null
    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalled();
    // Since no guid, no try to call temp address
    expect(addressServiceSpy.getTempAddress).not.toHaveBeenCalled();
  });

  it('ensure try to read default and temp address at startup', () => {
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
    const perfectAddressVerification = buildPerfectAddressVerification();
    addressServiceSpy.verifyAddress.and.returnValue(of(clone(perfectAddressVerification)));
    fixture.detectChanges();

    childComponent.valueChanged.emit(buildPerfectAddress());
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
    expect(groupInstance.value).toBe('entered');
  });

  it('test suggestion selection changes address and saves temp address and updates child component', () => {
    const addresses = emitAddressThatTriggersSuggestion();
    component.activityGuid = '123';
    const radioGroupComponentDebug = fixture.debugElement.query(By.directive(MatRadioGroup));
    const radioDebugElements: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatRadioButton));
    const radioInstances = radioDebugElements.map(debugEl => debugEl.componentInstance) as MatRadioButton[];
    const groupInstance: MatRadioGroup = radioGroupComponentDebug.injector.get<MatRadioGroup>(MatRadioGroup);
    fixture.detectChanges();
    expect(groupInstance.selected.value).toBe('entered');
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
    addressServiceSpy.verifyAddress.and.returnValue(of(new AddressVerificationResponse(incomingPerfectAddress)));
    childComponent.valueChanged.emit(incomingPerfectAddress);
    fixture.detectChanges();

    // suggestion box gone?
    const suggestionMatCard = fixture.debugElement.query(By.css('#suggestionMatCard'));
    expect(suggestionMatCard).toBeNull();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(incomingPerfectAddress, '123');

    // after all that. We never called save "real" address
    expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();

  });

  it('test global address error from EasyPost', () => {
    component.activityGuid = '123';
    const validationMessageBefore = findValidationMessageDebug(fixture);
    expect(validationMessageBefore).toBeNull();
    const addressToEnter = buildPerfectAddress();
    addressToEnter.street2 = 'NO PLACE THAT IS GOOD';
    // field 'address' is the global error.
    const overallAddressErrors: AddressError[] = [{ code: '123', field: 'address', message: 'Bad address' }];
    const verificationStatus: AddressVerificationStatus = {
      address: new Address(),
      isDeliverable: false,
      code: 'BAD!',
      errors: overallAddressErrors
    };
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

  it('test field level error from EasyPost', () => {
    component.activityGuid = '123';
    const validationMessageBefore = findValidationMessageDebug(fixture);
    expect(validationMessageBefore).toBeNull();
    const addressToEnter = buildPerfectAddress();
    addressToEnter.street2 = 'NO PLACE THAT IS GOOD';
    // field 'address' is the global error.
    const overallAddressErrors: AddressError[] = [{ code: '123', field: 'street1', message: 'Bad street1!!' }];
    const verificationStatus: AddressVerificationStatus = {
      address: new Address(),
      isDeliverable: false,
      code: 'REALLYBAD!',
      errors: overallAddressErrors
    };
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

  it('test show verify warnings', fakeAsync(() => {
    component.activityGuid = '123';

    const validationMessageBefore = findValidationMessageDebug(fixture);
    expect(validationMessageBefore).toBeNull();
    const addressToEnter = buildPerfectAddress();
    addressToEnter.street2 = 'NO PLACE THAT IS GOOD';
    // field 'address' is the global error.
    const verificationResponseWithWarningForEntered = new AddressVerificationResponse(addressToEnter);
    const warningMsg = 'You have been warned!';
    verificationResponseWithWarningForEntered.warnings.entered = [{ code: 'WARNING', message: warningMsg }];

    addressServiceSpy.verifyAddress.and.returnValue(of(verificationResponseWithWarningForEntered));
    fixture.detectChanges();

    let formErrorMessagesAfterVerify = null;
    component.errorMessagesToDisplay$.subscribe(msgs => formErrorMessagesAfterVerify = msgs);

    childComponent.valueChanged.emit(addressToEnter);
    fixture.detectChanges();
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalledWith(addressToEnter);
    const validationMessageAfter = findValidationMessageDebug(fixture);
    expect(validationMessageAfter).not.toBeNull();
    expect(formErrorMessagesAfterVerify).not.toBeNull();
    expect(formErrorMessagesAfterVerify[0]).toEqual(warningMsg);
    // we save temp address even if it has errors
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addressToEnter, '123');
  }));

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
    spyOnSubmitAnnounced.and.returnValue(hot('--a', { a: (new ActivityResponse('blah')) }));
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

  it('test saving partial address from input component', fakeAsync(() => {
    // this makes sure child component gets initial value from parent embedded
    const spyOnSubmitAnnounced = spyOnProperty(submitAnnounceService, 'submitAnnounced$', 'get');
    spyOnSubmitAnnounced.and.returnValue(hot('--a', { a: (new ActivityResponse('blah')) }));
    fixture.detectChanges();
    const partialAddressFromInputComponent = new Address({
      name: 'hello',
      country: 'US',
      zip: '01234',
      street1: '22 BLAH STREET',
      state: 'MA'
    });
    component.activityGuid = '123';
    const validationFailureResponse = {
      code: 'ADDRESS.VERIFY.FAILURE',
      message: 'Unable to verify address.',
      errors:
        [{
          code: 'E.ADDRESS.INVALID',
          field: 'address',
          message: 'Invalid city/state/ZIP',
          suggestion: null
        }, { code: 'E.ADDRESS.NOT_FOUND', field: 'address', message: 'Address not found', suggestion: null }]
    };
    addressServiceSpy.verifyAddress.and.returnValue(throwError(validationFailureResponse));
    // here comes the partial address
    console.log('Emitting address');
    childComponent.address = partialAddressFromInputComponent;
    childComponent.valueChanged.emit(partialAddressFromInputComponent);
    console.log('About to detect changes');
    fixture.detectChanges();
    console.log('After detect changes');
    expect(addressServiceSpy.verifyAddress).toHaveBeenCalledWith(partialAddressFromInputComponent);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(partialAddressFromInputComponent, '123');
    expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();
    expect(addressServiceSpy.deleteTempAddress).not.toHaveBeenCalled();
    const errorComponent = findValidationMessageDebug(fixture);
    expect(errorComponent).not.toBeNull();
    expect(findRadioGroupDebug(fixture)).toBeNull();

    getTestScheduler().flush();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(spyOnSubmitAnnounced).toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
    expect(addressServiceSpy.saveAddress).toHaveBeenCalledWith(partialAddressFromInputComponent, false);
    expect(addressServiceSpy.deleteTempAddress).toHaveBeenCalledWith('123');
  }));


  it('ensure we save the correct temporary address', fakeAsync(() => {
    const activityGuid = '123';
    const tempAddress = buildPerfectAddress();
    component.activityGuid = activityGuid;
    console.log('setting up stuff now');
    addressServiceSpy.findDefaultAddress.and.returnValue(of(null));
    addressServiceSpy.getTempAddress.and.returnValue(of(tempAddress));
    addressServiceSpy.verifyAddress.and.returnValue(of(new AddressVerificationResponse(tempAddress)));

    fixture.detectChanges();

    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalled();
    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalledTimes(1);
    expect(addressServiceSpy.getTempAddress).toHaveBeenCalled();
    expect(addressServiceSpy.findDefaultAddress).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    // childComponent.address = tempAddress;
    expect(childComponent.address).toBe(tempAddress);
    expect(addressServiceSpy.getTempAddress).toHaveBeenCalled();
    // expect(addressServiceSpy.saveTempAddress).not.toHaveBeenCalled();
    expect(findValidationMessageDebug(fixture)).toBeNull();
    expect(findRadioGroupDebug(fixture)).toBeNull();
    expect(addressServiceSpy.saveAddress).not.toHaveBeenCalled();
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(tempAddress, activityGuid);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(1);
    const addressFromChild = buildPerfectAddress();
    addressFromChild.name = 'NEW NAME';
    childComponent.valueChanged.emit(addressFromChild);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledWith(addressFromChild, activityGuid);
    expect(addressServiceSpy.saveTempAddress).toHaveBeenCalledTimes(2);
    expect(addressServiceSpy.deleteTempAddress).not.toHaveBeenCalled();
  }));

  it('hide country field when property is set', fakeAsync(() => {
    fixture.detectChanges();
    expect(childComponent.country).toBeNull();
    component.country = 'US';
    component.ngOnInit();
    fixture.detectChanges();
    expect(childComponent.country).toBe('US');
    component.country = null;
    component.ngOnInit();
    fixture.detectChanges();
    expect(childComponent.country).toBeNull();
    component.activityGuid = '123';
    component.country = 'US';
    let tempAddress = new Address({ country: 'CA' });
    addressServiceSpy.getTempAddress.and.returnValue(of(tempAddress));
    component.ngOnInit();
    fixture.detectChanges();

    expect(childComponent.country).toBeNull();
    component.activityGuid = '123';
    component.country = 'CA';
    tempAddress = new Address({ country: 'CA' });
    addressServiceSpy.getTempAddress.and.returnValue(of(tempAddress));
    component.ngOnInit();
    fixture.detectChanges();
    expect(childComponent.country).toBe('CA');
  }));

  it('test component busy output', fakeAsync(() => {
    component.activityGuid = '123';
    const perfectAddress = buildPerfectAddress();
    addressServiceSpy.verifyAddress.and.callFake(() => cold('a', { a: buildPerfectAddressVerification() }));
    addressServiceSpy.saveTempAddress.and.callFake(() => cold('-a', { a: true }));
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

    addressServiceSpy.verifyAddress.and.returnValue(of(new AddressVerificationResponse(buildPerfectAddress())));
    fixture.detectChanges();

    childComponent.valueChanged.emit(enteredAddress);
    fixture.detectChanges();
    return { enteredAddress, suggestedAddress: buildPerfectAddress() };
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
const buildPerfectAddressVerification = (): AddressVerificationResponse => {
  const perfectAddressVerify = new AddressVerificationResponse(buildPerfectAddress());
  return perfectAddressVerify;
};

