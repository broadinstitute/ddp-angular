import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorsService} from '../services/errors.service';
import {Auth} from '../services/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  // set this header on any request that you don't want processed
  // by this interceptor
  public static InterceptorSkipHeader = 'X-Skip-Interceptor';

  private readonly ignoreStatuses: number[] = [401];

  constructor(private readonly errorsService: ErrorsService,
              private readonly authService: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var ignoreError = req?.headers?.has(HttpInterceptorService.InterceptorSkipHeader);
    // InterceptorSkipHeader is only used internally to DSM.  don't pass it on to servers.
    const cleanedHeaders = req.clone().headers.delete(HttpInterceptorService.InterceptorSkipHeader);
    var cleanReq = req.clone({ headers: cleanedHeaders });
    return next.handle(cleanReq).pipe(
      catchError((error: any) => {
        if (!ignoreError) {
          if (error instanceof HttpErrorResponse) {
            !this.ignoreStatuses.includes(error?.status) &&
            this.errorsService.openSnackbar(error);
            error?.status === 401 && this.authService.doLogout();
          }
          return throwError(() => error);
        }
      })
    );
  }
}
