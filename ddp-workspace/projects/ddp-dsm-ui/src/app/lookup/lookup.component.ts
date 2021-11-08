import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Lookup } from './lookup.model';
import { DSMService } from '../services/dsm.service';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent {
  @Input() lookupValue: string;
  @Input() lookupType: string;
  @Input() disabled = false;
  @Input() fieldName: string;
  @Input() placeholder: string;
  @Input() largeInputField = false;
  @Input() multiLineInput = false;
  @Input() colorDuringPatch = false;

  @Output() lookupResponse = new EventEmitter();

  lookups: Array<Lookup> = [];
  currentPatchField: string;

  // TODO: check is it correct ? - unused compService
  constructor(private dsmService: DSMService, private compService: ComponentService) {
  }

  public checkForLookup(): Array<Lookup> {
    let jsonData: any[];
    if (this.lookupValue.trim() !== '') {
      if (!(this.lookupValue.length > 1 && this.lookups.length === 0)) {
        this.dsmService.lookupValue(this.lookupType, this.lookupValue, localStorage.getItem(ComponentService.MENU_SELECTED_REALM))
          .subscribe(// need to subscribe, otherwise it will not send!
            data => {
              this.lookups = [];
              jsonData = data;
              jsonData.forEach((val) => {
                const value = Lookup.parse(val);
                this.lookups.push(value);
              });
            }
          );
      }
    }
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
}
