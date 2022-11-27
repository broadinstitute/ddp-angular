import {Injectable, NgZone} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {ErrorSnackbarComponent} from "../Shared/components/error-snackbar/error-snackbar.component";
import {IHttpErrorResponseHistoryItem} from "../Shared/interfaces/IHttpErrorResponseHistoryItem";

class HttpErrorResponsesHistory implements IHttpErrorResponseHistoryItem {
  constructor(public httpErrorResponse: HttpErrorResponse, public timeStamp: Date) {}
}

@Injectable({providedIn: "root"})
export class ErrorsService {
  public readonly HttpErrorResponsesHistory: IHttpErrorResponseHistoryItem[] = [];

  constructor(private _snackBar: MatSnackBar, private ngZone: NgZone) {
  }

  private getSnackbarConfig(httpErrorResponse: HttpErrorResponse): MatSnackBarConfig {
    return {data: httpErrorResponse, panelClass: 'snackbarRestyleError'};
  }

  public clearErrors(): void {
    this.HttpErrorResponsesHistory.splice(0,  this.HttpErrorResponsesHistory.length);
  }


  public openSnackbar(httpErrorResponse: HttpErrorResponse) {
    this.HttpErrorResponsesHistory.push(new HttpErrorResponsesHistory(httpErrorResponse, new Date()));

    this.ngZone.run(() => {
      this._snackBar.openFromComponent(ErrorSnackbarComponent, this.getSnackbarConfig(httpErrorResponse));
    })
  }

}
