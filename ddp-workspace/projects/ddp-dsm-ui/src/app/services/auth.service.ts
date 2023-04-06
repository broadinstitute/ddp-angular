import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {
  throwError,
  Subject,
  Subscription, Observable, BehaviorSubject, fromEvent
} from 'rxjs';
import {catchError} from 'rxjs/operators';

import { NameValue } from '../utils/name-value.model';
import { SessionService } from './session.service';
import { RoleService } from './role.service';
import { DSMService } from './dsm.service';
import { ComponentService } from './component.service';
import {LocalStorageService} from './local-storage.service';

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var DDP_ENV: any;

@Injectable({providedIn: 'root'})
export class Auth implements OnDestroy {
  static AUTH0_TOKEN_NAME = 'auth_token';

  public static AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

  private baseUrl = DDP_ENV.baseUrl;
  private authUrl = this.baseUrl + DSMService.UI + 'auth0';

  private eventsSource = new Subject<string>();

  private realmListForPicklist = new BehaviorSubject<NameValue[]>([]);

  events = this.eventsSource.asObservable();

  kitDiscard = new Subject<string>();
  confirmKitDiscard = this.kitDiscard.asObservable();

  realmList: Array<NameValue>;
  selectedRealm: string;

  loadRealmsSubscription: Subscription;

  authError = new BehaviorSubject<string | null>(null);

  selectedStudy = new BehaviorSubject<string>('');

  storageEventSource$: Subscription;

  // Configure Auth0
  lock = new Auth0Lock(DDP_ENV.auth0ClientKey, DDP_ENV.auth0Domain, {
    auth: {
      redirect: false,
      responseType: 'token'
    },
    popupOptions: { width: 300, height: 400, left: 200, top: 300 },
    languageDictionary: {
      title: 'DDP Study Management'
    },
    theme: {
      logo: '/assets/images/logo-broad-institute.svg',
      primaryColor: '#5e7da4'
    },
    autoclose: true,
    // container: 'auth'
    // rememberLastLogin: false,
  });

  // Configure Auth0 for confirm kit discard
  lockForDiscard = new Auth0Lock(DDP_ENV.auth0ClientKey, DDP_ENV.auth0Domain, {
    auth: {
      responseType: 'token',
      redirect: false,
      // sso: false,
      params: {prompt: 'select_account'}
    },
    languageDictionary: {
      title: 'Login to confirm'
    },
    theme: {
      logo: '',
      primaryColor: '#5e7da4'
    },
    autoclose: true,
    rememberLastLogin: false,
    allowSignUp: false,
    allowedConnections: [ 'google-oauth2' ]
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient,
              private sessionService: SessionService, private role: RoleService,
              private compService: ComponentService, private dsmService: DSMService, private localStorageService: LocalStorageService
               ) {
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult: any) => {
      localStorage.setItem(Auth.AUTH0_TOKEN_NAME, authResult.idToken);
      const payload = {
        token: authResult.idToken
      };
      this.doLogin(payload);
    });
    this.lock.on('authorization_error', () => {
      this.authError.next('You are not allowed to login');
    });

    this.lockForDiscard.on('authenticated', (authResult: any) => {
      this.kitDiscard.next(authResult.idToken);
    });

    this.storageEventSource$ = fromEvent<StorageEvent>(window, 'storage').subscribe(
      event => {
        if (event.key === SessionService.DSM_TOKEN_NAME && event.newValue === null) {
          this.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  public getSelectedStudy(): Observable<string> {
    return this.selectedStudy.asObservable();
  }

  public set setSelectedStudy(study: string) {
    this.selectedStudy.next(study);
  }

  public authenticated(): boolean {
    return this.sessionService.isAuthenticated();
  }

  public getRealmListObs(): Observable<NameValue[]> {
    return this.realmListForPicklist.asObservable();
  }

  public doLogout(): void {
    this.localStorageService.clear();
    this.sessionService.logout();
    this.selectedRealm = null;
}
  public sessionLogout(): void {
    this.doLogout();
  }

  public doLogin(authPayload: any): void {
    const dsmObservable = this.http.post(this.authUrl, authPayload, this.buildHeaders()).pipe(
      catchError(this.handleError.bind(this))
    );

    let dsmResponse: any;

    dsmObservable.subscribe({
      next: response => dsmResponse = response,
      complete: () => {
        const dsmToken = dsmResponse.dsmToken;

        this.sessionService.setDSMToken(dsmToken);
        this.role.setRoles(dsmToken);

        this.realmList = [];
        this.getRealmList();

        this.authError.next(null);
      }
    });
  }

  public buildHeaders(): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.sessionService.getAuthBearerHeaderValue()
    });
    return {headers, withCredentials: true};
  }

  private checkForAuth0Error(error: any): boolean {
    return (error instanceof HttpErrorResponse &&  error && error.hasOwnProperty('status')
      && error.hasOwnProperty('ok') && error.url &&
      (error.status === 401 || error.status === 0)
      && !error.ok && error.url.includes('ui/auth0'));
  }
  private handleError(error: any): Observable<any> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg: string | null = null;
    if(this.checkForAuth0Error(error)) {
      this.doLogout();
      this.lock.show();
      return;
    }
    if(error.status === 500) {
      errMsg = 'Incorrect user name or password.';
    } else {
      errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    }

    this.authError.next(errMsg);

    console.error(errMsg); // log to console instead
    return throwError(() => new Error(errMsg));
  }

  getRealmList(): void {
    if (this.realmList == null || this.realmList.length === 0) {
      let jsonData: any[];
      this.realmList = [];

      if (this.loadRealmsSubscription != null) {
        this.loadRealmsSubscription.unsubscribe();
      }
      this.loadRealmsSubscription = this.dsmService.getStudies().subscribe(
        data => {
          jsonData = data;
          jsonData.forEach((val) => {
            this.realmList.push(NameValue.parse(val));
          });

          this.realmListForPicklist.next(this.realmList);

          const selectedRealm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);

          this.setSelectedStudy = this.realmList.find(realm => realm.name === selectedRealm)?.value;
        }
      );
    }
  }

  selectRealm(realm: string, page?: string): void {
    const navigateUrl = `${realm}/${page || ''}`;

    sessionStorage.setItem(ComponentService.MENU_SELECTED_REALM, realm);

    page ? this.navigateWithParam(navigateUrl) : this.router.navigate([navigateUrl]);
  }

  private navigateWithParam(navigateUrl: string): void {
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => {
        this.router.navigate([navigateUrl]);
      });
  }

  ngOnDestroy(): void {
    this.storageEventSource$.unsubscribe();
  }

}
