import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressInputComponent } from './addressInput.component';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../services/addressCountry.service';
import { AddressInputService } from './addressInput.service';
import { Directive, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


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

  beforeEach(async(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['findAllCountryInfoSummaries']);
    aisSpy = jasmine.createSpyObj('AddressInputService', ['createForm']);

    addressServiceSpy = jasmine.createSpyObj('AddressService', ['verifyAddress']);

    TestBed.configureTestingModule({
      declarations: [ AddressInputComponent, FakeAddressGoogleAutocomplete ],
      providers: [
        {provide: CountryService, useValue: countryServiceSpy},
        {provide: AddressService, useValue: addressServiceSpy},
        AddressInputService],
      imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, NoopAnimationsModule],
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
