import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {EMPTY, Observable, tap} from "rxjs";
import {catchError} from "rxjs/operators";
import {OnLineService} from "../services/onLine.service";
import {Injectable} from "@angular/core";
import {ErrorsService} from "../services/errors.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private onLineService: OnLineService, private errorsService: ErrorsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.onLineService.isOnline) {
      this.onLineService.openOfflineRequestSnackbar()
      return EMPTY;
    }

    return next.handle(req).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        this.errorsService.openSnackbar(httpErrorResponse);
        return EMPTY
      })
    )
  }
}
