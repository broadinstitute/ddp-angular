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

// set this header on any request that you don't want processed
// by this interceptor
export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly ignoreStatuses: number[] = [401];

  constructor(private readonly errorsService: ErrorsService,
              private readonly authService: Auth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        if (!(req.headers.has(InterceptorSkipHeader))) {
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
