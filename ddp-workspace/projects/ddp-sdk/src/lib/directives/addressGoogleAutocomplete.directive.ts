/// <reference types="@types/googlemaps" />
import { Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScriptLoaderService } from '../services/scriptLoader.service';
import { Address } from '../models/address';
import { ConfigurationService } from '../services/configuration.service';
import { Observable, Subject } from 'rxjs';
import { concat, share, skip, takeUntil } from 'rxjs/operators';
import * as _ from 'underscore';
import Autocomplete = google.maps.places.Autocomplete;
import PlaceResult = google.maps.places.PlaceResult;
import AutocompleteOptions = google.maps.places.AutocompleteOptions;
import ComponentRestrictions = google.maps.places.ComponentRestrictions;

@Directive({
    selector: '[addressgoogleautocomplete]'
})
export class AddressGoogleAutocompleteDirective implements OnInit, OnDestroy, OnChanges {
    @Input() autocompleteRestrictCountryCode?: string | Array<string>;
    /**
     * address object built from Google Places selected address.
     * type EventEmitter<Address>
     */
    @Output() addressChanged: EventEmitter<Address> = new EventEmitter();
    // The GooglePlaceAutocomplete object reference
    private autoComplete: Autocomplete;
    private scriptLoader$: Observable<any>;
    private countryCode$: Subject<string> = new Subject();
    private ngUnsubscribe = new Subject();

    constructor(private autocompleteInput: ElementRef,
        private scriptLoader: ScriptLoaderService,
        @Inject('ddp.config') private configService: ConfigurationService) {
        this.scriptLoader$ = this.scriptLoader
            .load({
                name: 'google-maps-places',
                src: 'https://maps.googleapis.com/maps/api/js?key=' + this.configService.mapsApiKey + '&libraries=places'
            }).pipe(share());
    }

    public ngOnInit(): void {
        this.scriptLoader$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
            () => {
                if (!this.autoComplete) {
                    this.setupAutocomplete();
                }
            },
            () => console.warn('Could not load google-maps-places script'));
        // making sure that any countryCodes handled AFTER scriptloader has processed
        this.scriptLoader$.pipe(concat(this.countryCode$), skip(1), takeUntil(this.ngUnsubscribe)).subscribe((countryCode) => {
            const restrictions = this.buildAutocompleteComponentRestrictions();
            this.autoComplete.setComponentRestrictions(restrictions);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // if first change, we will pick it up in ngOnInit
        if (changes['autocompleteRestrictCountryCode'].isFirstChange()) {
            return;
        }
        // if not countryCode has changed
        this.countryCode$.next(changes['autocompleteRestrictCountryCode'].currentValue);
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private buildAutocompleteComponentRestrictions(): ComponentRestrictions {
        let countryCodeRestrict;
        if (Array.isArray(this.autocompleteRestrictCountryCode)) {
            countryCodeRestrict = this.autocompleteRestrictCountryCode;
        } else if (_.isString(this.autocompleteRestrictCountryCode)) {
            countryCodeRestrict = this.autocompleteRestrictCountryCode;
        } else {
            countryCodeRestrict = [];
        }
        return { country: countryCodeRestrict };
    }

    private setupAutocomplete(): void {
        const options: AutocompleteOptions = {
            types: ['address'],
            componentRestrictions: this.buildAutocompleteComponentRestrictions()
        };
        // Google Places Autocomplete works by letting the API take over the <input> elements
        this.autoComplete = new google.maps.places.Autocomplete(this.autocompleteInput.nativeElement, options);
        this.autoComplete.addListener('place_changed', () => {
            const newAddress = this.getGoogleAddress();
            newAddress && this.addressChanged.emit(newAddress);
        });
    }

    private getGoogleAddress(): Address | null {
        const place: PlaceResult = this.autoComplete.getPlace();
        if (!place || this.isFallbackResult(place)) {
            return null;
        }

        // a little utility to pick out the data we need from Google's PlaceResult
        const fieldVal = (typeName: string, useLongName = true) => {
            const comp: any | null = place.address_components.find(o => o.types.indexOf(typeName) >= 0);
            return comp ? comp[useLongName ? 'long_name' : 'short_name'] : '';
        };
        const googleAddress = new Address();
        // these mappings have been tested for US, CA and PR
        googleAddress.street1 = fieldVal('street_number') + ' ' + fieldVal('route', false);
        googleAddress.city = fieldVal('locality');
        // sometimes we need to use neighborhood
        if (googleAddress.city === '') {
            googleAddress.city = fieldVal('neighborhood');
        }
        googleAddress.state = fieldVal('administrative_area_level_1', false);
        googleAddress.country = fieldVal('country', false);
        googleAddress.zip = fieldVal('postal_code');

        return googleAddress;
    }

    /**
     * If Maps API didn't find it and user presses Enter, or Maps API request out-right failed, the returned
     * result will contain only the `name` property with the user's input.
     */
    private isFallbackResult(place: PlaceResult): boolean {
        const keys = _.keys(place);
        return keys.length === 1 && keys[0] === 'name';
    }
}
