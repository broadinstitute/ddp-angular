import { TestBed } from '@angular/core/testing';
import { AddressInputService } from './addressInput.service';
import { CountryService } from '../../services/addressCountry.service';
import { AddressService } from 'ddp-sdk';
import { ChangeDetectorRef } from '@angular/core';


describe('AddressInputService', () => {
  let ais: AddressInputService;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
  beforeEach(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['findCountryInfoByCode']);
    addressServiceSpy = jasmine.createSpyObj('AddressService', ['verifyAddress']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    TestBed.configureTestingModule({});
    ais = new AddressInputService(countryServiceSpy, addressServiceSpy, cdrSpy);
  });

  it('should be created', () => {
    expect(ais).toBeTruthy();
  });
});
