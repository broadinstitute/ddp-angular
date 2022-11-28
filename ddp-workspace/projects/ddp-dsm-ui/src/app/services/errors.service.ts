import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from '@angular/material/snack-bar';
import {ErrorSnackbarComponent} from '../Shared/components/error-snackbar/error-snackbar.component';
import {IHttpErrorResponseHistoryItem} from '../Shared/interfaces/IHttpErrorResponseHistoryItem';

class HttpErrorResponsesHistory implements IHttpErrorResponseHistoryItem {
  constructor(public httpErrorResponse: HttpErrorResponse, public timeStamp: Date) {}
}

@Injectable({providedIn: 'root'})
export class ErrorsService {
  public readonly HttpErrorResponsesHistory: IHttpErrorResponseHistoryItem[] = [];

  private activeMatSnackbar: MatSnackBarRef<ErrorSnackbarComponent>;

  constructor(private _snackBar: MatSnackBar) {}

  public clearErrors(): void {
    this.HttpErrorResponsesHistory.splice(0,  this.HttpErrorResponsesHistory.length);
  }

  public openSnackbar(httpErrorResponse: HttpErrorResponse): void {
    this.HttpErrorResponsesHistory.push(new HttpErrorResponsesHistory(httpErrorResponse, new Date()));
    this.activeMatSnackbar = this._snackBar.openFromComponent(ErrorSnackbarComponent, this.getSnackbarConfig(httpErrorResponse));
  }

  public dismiss(): void {
    this.activeMatSnackbar && this.activeMatSnackbar.dismiss();
  }

  private getSnackbarConfig(httpErrorResponse: HttpErrorResponse): MatSnackBarConfig {
    return {data: httpErrorResponse, panelClass: 'snackbarRestyleError'};
  }

}
