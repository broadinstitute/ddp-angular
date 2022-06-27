import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

export class FONHttpInterceptor implements HttpInterceptor {
  readonly DSM_TOKEN_NAME = 'dsm_token';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.getDSMToken
      })
    })
    return next.handle(modifiedRequest);
  }

  private get getDSMToken(): string {
    return 'Bearer ' + localStorage.getItem(this.DSM_TOKEN_NAME);
  }
}
