import { TestBed } from '@angular/core/testing';
import { AddressInputService } from './addressInput.service';
import { CountryService } from '../../services/addressCountry.service';
import { AddressService } from '../../services/address.service';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { bufferCount } from 'rxjs/operators';


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
  it('change in country updates countryInfo$ observable', done => {
    expect(countryServiceSpy.findCountryInfoByCode).not.toHaveBeenCalled();
    countryServiceSpy.findCountryInfoByCode.and.callFake((arg) => {
      if (arg === 'CA') {
        return of({name: 'Canada', code: 'CA', subnationalDivisionTypeName: 'blah', subnationalDivisions: [],
          postalCodeLabel: 'Province', postalCodeRegex: 'x'});
      } else {
        return of(null);
      }
    });
    ais.countryInfo$.pipe(bufferCount(2)).subscribe(countryArr => {
      expect(countryArr.length).toBe(2);
      expect(countryArr[0]).toBeNull();
      expect(countryArr[1].name).toBe('Canada');
      done();
    });
    ais.addressForm.patchValue({country : 'CA'});
  });

});
