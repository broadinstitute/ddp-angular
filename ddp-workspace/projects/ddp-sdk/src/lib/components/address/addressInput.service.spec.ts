import { TestBed } from '@angular/core/testing';
import { AddressInputService } from './addressInput.service';
import { CountryService } from '../../services/addressCountry.service';
import { AddressService } from '../../services/address.service';
import { ChangeDetectorRef } from '@angular/core';
import { combineLatest, of, timer } from 'rxjs';
import { bufferCount, combineAll, startWith } from 'rxjs/operators';
import { Address } from '../../models/address';
import { fail } from 'assert';


describe('AddressInputService', () => {
  let ais: AddressInputService;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;
  beforeEach(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['findCountryInfoByCode']);
    countryServiceSpy.findCountryInfoByCode.and.callFake((arg) => {
      if (arg === 'CA') {
        return of({name: 'Canada', code: 'CA', subnationalDivisionTypeName: 'Province', subnationalDivisions: [],
          postalCodeLabel: 'Postal Code', postalCodeRegex: 'xxxx'});
      } else if (arg === 'US') {
        return of({name: 'United States', code: 'US', subnationalDivisionTypeName: 'State', subnationalDivisions: [],
          postalCodeLabel: 'ZIP Code', postalCodeRegex: 'xxxx'});
      } else {
        return of(null);
      }
    });
    addressServiceSpy = jasmine.createSpyObj('AddressService', ['verifyAddress']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    TestBed.configureTestingModule({});
    ais = new AddressInputService(countryServiceSpy, addressServiceSpy, cdrSpy);
  });

  it('should be created', () => {
    expect(ais).toBeTruthy();
  });
  it('change in country updates countryInfo$ observable', done => {
    expect(countryServiceSpy.findCountryInfoByCode).not.toHaveBeenCalled();
    ais.countryInfo$.pipe(bufferCount(3)).subscribe(countryArr => {
      expect(countryArr.length).toBe(3);
      expect(countryArr[0]).toBeNull();
      expect(countryArr[1].name).toBe('Canada');
      expect(countryArr[2]).toBeNull();
      done();
    });
    ais.addressForm.patchValue({country : 'CA'});
    // unselect country
    ais.addressForm.patchValue({country : ''});
  });
  it('change in country updates postalCodeLabel$ observable', done => {
    expect(countryServiceSpy.findCountryInfoByCode).not.toHaveBeenCalled();
    ais.postalCodeLabel$.pipe(bufferCount(3)).subscribe(postalCodeLabels => {
      expect(postalCodeLabels.length).toBe(3);
      // there should be a default label. Not worrying about value
      expect(postalCodeLabels[0]).toBeTruthy();
      expect(postalCodeLabels[1]).toBe('Postal Code');
      expect(postalCodeLabels[2]).toBeTruthy();
      done();
    });
    ais.addressForm.patchValue({country : 'CA'});
    // unselect country
    ais.addressForm.patchValue({country : ''});
  });
  it('change in country updates postalCodeLabel$ observable', done => {
    expect(countryServiceSpy.findCountryInfoByCode).not.toHaveBeenCalled();
    const testPostalCodeLabel = 'Province';
    countryServiceSpy.findCountryInfoByCode.and.callFake((arg) => {
      if (arg === 'CA') {
        return of({name: 'Canada', code: 'CA', subnationalDivisionTypeName: 'blah', subnationalDivisions: [],
          postalCodeLabel: testPostalCodeLabel, postalCodeRegex: 'x'});
      } else {
        return of(null);
      }
    });
    ais.postalCodeLabel$.pipe(bufferCount(3)).subscribe(postalCodeLabels => {
      expect(postalCodeLabels.length).toBe(3);
      // there should be a default label. Not worrying about value
      expect(postalCodeLabels[0]).toBeTruthy();
      expect(postalCodeLabels[1]).toBe(testPostalCodeLabel);
      expect(postalCodeLabels[2]).toBeTruthy();
      done();
    });
    ais.addressForm.patchValue({country : 'CA'});
    // unselect country
    ais.addressForm.patchValue({country : ''});
  });

  it('Setting input address updates currentAddress$ and countryInfo$ observable', done => {
    const testAddress = new Address();
    testAddress.name = 'Rapunzel';
    testAddress.street1 = '1 Mockingbird Lane';
    testAddress.street2 = '2nd Floor';
    testAddress.country = 'US';
    testAddress.state = 'AK';
    testAddress.zip = '90120';
    testAddress.phone = '867-5309';
    testAddress.city = 'Fairbanks';
    testAddress.guid = '123';

    combineLatest([
        ais.currentAddress$.pipe(bufferCount(2)),
        ais.countryInfo$.pipe(bufferCount(2))
        ]).subscribe(([addressArr, countryInfoArr]) => {
          expect(addressArr[0]).toBeTruthy();
          expect(addressArr[0].name).toBeFalsy();
          expect(addressArr[0].zip).toBeFalsy();

          expect(addressArr[1]).toBeTruthy();
          expect(addressArr[1].name).toBe(testAddress.name);
          expect(addressArr[1].street1).toBe(testAddress.street1);
          expect(countryInfoArr[1].name).toBe('United States');
          done();
    });

    // push an input address
    ais.inputAddress$.next(testAddress);
  });

  it('Setting input address updates does not push address to addressOutputStream$', done => {
    const testAddress = new Address();
    testAddress.name = 'Rapunzel';
    testAddress.street1 = '1 Mockingbird Lane';
    testAddress.street2 = '2nd Floor';
    testAddress.country = 'US';
    testAddress.state = 'AK';
    testAddress.zip = '90120';
    testAddress.phone = '867-5309';
    testAddress.city = 'Fairbanks';
    testAddress.guid = '123';

    ais.addressOutputStream$.subscribe(address => fail('An address was emitted. This should not happen'));

    timer(1000).subscribe(val => {
      expect(1).toBe(1);
      done();
    });

    // push an input address
    ais.inputAddress$.next(testAddress);
  });

});
