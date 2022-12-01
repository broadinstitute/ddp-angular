import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ErrorsHistorySnackbarComponent} from '../errorsHistory-snackbar/errorsHistory-snackbar.component';

@Component({
  selector: 'app-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ErrorSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public httpErrorResponse: HttpErrorResponse,
    private _snackRef: MatSnackBarRef<ErrorSnackbarComponent>,
    private _bottomSheet: MatBottomSheet,
  ) {}

  public close(): void {
    this._snackRef.dismiss();
  }

  public seeMore(): void {
    this._bottomSheet.open(ErrorsHistorySnackbarComponent);
  }

}
