import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {Statics} from '../utils/statics';
import {ComponentService} from './component.service';

@Injectable({providedIn: 'root'})

export class LocalStorageService {

  public clear(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem(SessionService.DSM_TOKEN_NAME);
    localStorage.removeItem(Statics.PERMALINK);
    localStorage.removeItem(ComponentService.MENU_SELECTED_REALM);
  }
}
