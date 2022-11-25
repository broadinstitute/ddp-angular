import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorsService} from "../../../services/errors.service";
import {IHttpErrorResponseHistoryItem} from "../../interfaces/IHttpErrorResponseHistoryItem";

@Component({
  selector: 'app-errorsHistory-snackbar',
  templateUrl: './errorsHistory-snackbar.component.html',
  styleUrls: ['./errorsHistory-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsHistorySnackbarComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public httpErrorResponseHistoryItems: IHttpErrorResponseHistoryItem[],
              private _bottomSheetRef: MatBottomSheetRef<ErrorsHistorySnackbarComponent>,
              private errorService: ErrorsService
  ) {
  }

  public clearHistory(): void {
    this.errorService.clearErrors();
    !this.httpErrorResponseHistoryItems.length && this._bottomSheetRef.dismiss();
  }

}
