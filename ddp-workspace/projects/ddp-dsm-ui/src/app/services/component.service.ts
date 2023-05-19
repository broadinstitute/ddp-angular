import { Injectable } from '@angular/core';

import { DiscardSample } from '../discard-sample/discard-sample.model';
import { FieldSettings } from '../field-settings/field-settings.model';

// Service to send information to a childComponent, which is called per router!
@Injectable({providedIn: 'root'})
export class ComponentService {
  static MENU_SELECTED_REALM = 'selectedRealm';

  justReturning = false;
  customViews: any;
  editable: boolean;
  discardSample: DiscardSample;
  fieldSettings: Map<string, Array<FieldSettings>>;

  public getRealm(): string {
    return sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }
}
