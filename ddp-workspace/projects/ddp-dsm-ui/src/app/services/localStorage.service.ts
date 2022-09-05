import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {Statics} from '../utils/statics';
import {ComponentService} from './component.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})

export class LocalStorageService {

  private observeStudyChange = new BehaviorSubject<string>(localStorage.getItem(ComponentService.MENU_SELECTED_REALM));

  public clear(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem(SessionService.DSM_TOKEN_NAME);
    localStorage.removeItem(Statics.PERMALINK);
    localStorage.removeItem(ComponentService.MENU_SELECTED_REALM);
  }

  public emitStudyChange(study: string): void {
    this.observeStudyChange.next(study);
  }

  get studyChange$(): Observable<string> {
    return this.observeStudyChange.asObservable();
  }

  get selectedRealm(): string {
    return localStorage.getItem(ComponentService.MENU_SELECTED_REALM)
  }



}
