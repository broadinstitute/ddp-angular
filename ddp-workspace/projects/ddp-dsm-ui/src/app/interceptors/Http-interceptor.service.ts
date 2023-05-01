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

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly ignoreStatuses: number[] = [401];

  constructor(private errorsService: ErrorsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        error instanceof HttpErrorResponse &&
        !this.ignoreStatuses.includes(error?.status) &&
        this.errorsService.openSnackbar(error);

        return throwError(() => error);
      })
    );
  }
}
