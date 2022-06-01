import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  throwError,
  Subject,
  Subscription, Observable, BehaviorSubject
} from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NameValue } from '../utils/name-value.model';
import { SessionService } from './session.service';
import { RoleService } from './role.service';
import { DSMService } from './dsm.service';
import { ComponentService } from './component.service';
import { SessionMementoService } from 'ddp-sdk';

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var DDP_ENV: any;

@Injectable({providedIn: 'root'})
export class Auth {
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
              private compService: ComponentService, private dsmService: DSMService,
              private dssSessionService: SessionMementoService ) {
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

    this.setSelectedStudy = localStorage.getItem(ComponentService.MENU_SELECTED_REALM) || '';
  }

  public getSelectedStudy(): Observable<string> {
    return this.selectedStudy.asObservable();
  }

  public set setSelectedStudy(study: string) {
    this.selectedStudy.next(study);
  }

  public authenticated(): boolean {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'token'
    // return tokenNotExpired();
    return this.sessionService.isAuthenticated();
  }

  public getRealmListObs(): Observable<NameValue[]> {
    return this.realmListForPicklist.asObservable();
  }

  public logout(): void {
    // Remove token from localStorage
    localStorage.clear();
    this.sessionService.logout();
    this.selectedRealm = null;
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
        this.setDssSession(dsmToken);

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

  private handleError(error: any): Observable<any> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg: string | null = null;

    if(error.status === 500) {
      errMsg = 'User is not registered in DSM. Please make sure you selected the correct account.';
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
        }
      );
    }
  }

  selectRealm(realm: string, page?: string): void {
    const navigateUrl = `${realm}/${page || ''}`;

    localStorage.setItem(ComponentService.MENU_SELECTED_REALM, realm);

    page ? this.navigateWithParam(navigateUrl) : this.router.navigate([navigateUrl]);
  }

  private navigateWithParam(navigateUrl: string): void {
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => {
        this.router.navigate([navigateUrl]);
      });
  }

  private setDssSession(dsmToken: string): void {
    const accessToken = null;
    const userGuid = null;
    const locale = 'en';
    const expiresAtInSeconds: number = +this.sessionService.getTokenExpiration();
    // set DSS Session partially
    this.dssSessionService.setSession(accessToken, dsmToken, userGuid, locale, expiresAtInSeconds);
  }
}
