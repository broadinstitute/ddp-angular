import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddressInputComponent } from './addressInput.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../services/addressCountry.service';
import { AddressInputService } from './addressInput.service';
import { Directive, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { TranslateTestingModule } from '../../testsupport/translateTestingModule';
import { LoggingService } from '../../services/logging.service';


@Directive({
  selector: '[addressgoogleautocomplete]'
})
class FakeAddressGoogleAutocompleteDirective {
  @Input() autocompleteRestrictCountryCode: string | Array<string>;
}

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  let translateServiceSpy: jasmine.SpyObj<NGXTranslateService>;

  beforeEach(waitForAsync(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['findAllCountryInfoSummaries']);
    addressServiceSpy = jasmine.createSpyObj('AddressService', ['verifyAddress']);
    translateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    translateServiceSpy.getTranslation.and.callFake((word: string | Array<string>, keyToValue?: object) => of(
        Array.isArray(word) ?
          word.map((each, i) => ({each: 'label' + i})).reduce((prev, current) => ({...prev, ...current}), {}) as object :
          'label1'
      )
    );
    const loggingServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logDebug']);

    TestBed.configureTestingModule({
      declarations: [ AddressInputComponent, FakeAddressGoogleAutocompleteDirective ],
      providers: [
        {provide: CountryService, useValue: countryServiceSpy},
        {provide: AddressService, useValue: addressServiceSpy},
        {provide: NGXTranslateService, useValue: translateServiceSpy},
        {provide: LoggingService, useValue: loggingServiceSpy},
        {provide: 'ddp.config', useValue: {}},
        AddressInputService],
      imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, NoopAnimationsModule, TranslateTestingModule],
      // schemas needed to avoid problems with google autocomplete directive attributes in input element
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
