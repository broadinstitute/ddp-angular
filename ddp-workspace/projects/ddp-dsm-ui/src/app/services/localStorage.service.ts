import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {Statics} from '../utils/statics';
import {ComponentService} from './component.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})

export class LocalStorageService {

  private observeStudyChange = new BehaviorSubject<string>(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM));

  public clear(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem(SessionService.DSM_TOKEN_NAME);
    sessionStorage.removeItem(Statics.PERMALINK);
    sessionStorage.removeItem(ComponentService.MENU_SELECTED_REALM);
  }

  public emitStudyChange(study: string): void {
    this.observeStudyChange.next(study);
  }

  get studyChange$(): Observable<string> {
    return this.observeStudyChange.asObservable();
  }

  get selectedRealm(): string {
    return sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }



}
