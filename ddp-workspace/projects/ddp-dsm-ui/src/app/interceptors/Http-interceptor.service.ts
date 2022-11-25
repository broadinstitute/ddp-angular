import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {OnLineService} from "../services/onLine.service";
import {Injectable} from "@angular/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {ErrorSnackbarComponent} from "../Shared/components/error-snackbar/error-snackbar.component";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private onLineService: OnLineService, private _snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.onLineService.isOnline) {
      this.onLineService.openOfflineRequestSnackbar()
      return EMPTY;
    }

    return next.handle(req).pipe(catchError(this.handleError.bind(this)))
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const snackBarConfig: MatSnackBarConfig = {data: error, panelClass: 'snackbarRestyleError', duration: 5000};
    this._snackBar.openFromComponent(ErrorSnackbarComponent, snackBarConfig)
    return EMPTY;
  }
}
