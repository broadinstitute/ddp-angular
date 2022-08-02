import {
  Component,
  EventEmitter,
  Input,
  OnDestroy, OnInit,
  Output,
} from '@angular/core';

import { Lookup } from './lookup.model';
import { DSMService } from '../services/dsm.service';
import { ComponentService } from '../services/component.service';
import {debounceTime, distinctUntilChanged, exhaustMap, tap} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {Statics} from '../utils/statics';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit, OnDestroy {
  @Input() lookupValue: string;
  @Input() lookupType: string;
  @Input() disabled = false;
  @Input() fieldName: string;
  @Input() placeholder: string;
  @Input() largeInputField = false;
  @Input() multiLineInput = false;
  @Input() colorDuringPatch = false;

  @Output() lookupResponse = new EventEmitter<Lookup | string>();

  lookedUpValue = new Subject<string>();
  lookedUpValueUnsubscribe: Subscription;

  lookups: Array<Lookup> = [];
  currentPatchField: string;

  constructor(private dsmService: DSMService) {}

  ngOnInit(): void {
    this.lookedUpValueUnsubscribe = this.lookedUpValue
      .pipe(
        debounceTime(1000),
        distinctUntilChanged((prev, curr) => !!this.lookups.find(data => data.field1.value === curr) || curr === prev),
        exhaustMap(this.fetchLookedUpValue.bind(this)),
        tap(this.setValues.bind(this))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.lookedUpValueUnsubscribe.unsubscribe();
  }

  public checkForLookup(): Array<Lookup> {
    this.lookupValue.trim() !== '' && this.lookedUpValue.next(this.lookupValue);
    return this.lookups;
  }

  public setLookup(object: Lookup): boolean {
    this.lookupResponse.next(object);
    this.lookups = [];
    return false;
  }

  public getStyleDisplay(): string {
    if (this.lookups.length > 0) {
      return Statics.DISPLAY_BLOCK;
    } else {
      return Statics.DISPLAY_NONE;
    }
  }

  public changeValue(): void {
    this.lookupResponse.next(this.lookupValue);
  }

  currentField(field: string): void {
    this.currentPatchField = field;
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  private fetchLookedUpValue(value: string): Observable<any> {
   return this.dsmService.lookupValue(this.lookupType, value, localStorage.getItem(ComponentService.MENU_SELECTED_REALM));
  }

  private setValues(data: object[]): void {
    this.lookups = [];
    this.changeValue();
    data.forEach((data_value: object) => this.lookups.push(Lookup.parse(data_value)));
  }

}
