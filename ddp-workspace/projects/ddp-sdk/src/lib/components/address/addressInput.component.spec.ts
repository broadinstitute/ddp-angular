import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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


@Directive({
  selector: '[addressgoogleautocomplete]'
})
class FakeAddressGoogleAutocomplete {
  @Input() autocompleteRestrictCountryCode: string | Array<string>;

}
describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;
  let aisSpy: jasmine.SpyObj<AddressInputService>;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  const translateServiceSpy: jasmine.SpyObj<NGXTranslateService> = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);

  beforeEach(async(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['findAllCountryInfoSummaries']);
    aisSpy = jasmine.createSpyObj('AddressInputService', ['createForm']);

    addressServiceSpy = jasmine.createSpyObj('AddressService', ['verifyAddress']);
    // @ts-ignore
    translateServiceSpy.getTranslation.and.callFake((word: string | Array<string>, keyToValue?: object) => {
      return of(Array.isArray(word) ?
          word.map((each, i) => ({ each: 'label' + i })).reduce((prev, current) => ({ ...prev, ...current }), {}) as object :
          'label1');
    });

    TestBed.configureTestingModule({
      declarations: [ AddressInputComponent, FakeAddressGoogleAutocomplete ],
      providers: [
        {provide: CountryService, useValue: countryServiceSpy},
        {provide: AddressService, useValue: addressServiceSpy},
        {provide: NGXTranslateService, useValue: translateServiceSpy},
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
