import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ErrorsService} from "../../../services/errors.service";
import {IHttpErrorResponseHistoryItem} from "../../interfaces/IHttpErrorResponseHistoryItem";

@Component({
  selector: 'app-errorsHistory-snackbar',
  templateUrl: './errorsHistory-snackbar.component.html',
  styleUrls: ['./errorsHistory-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsHistorySnackbarComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<ErrorsHistorySnackbarComponent>,
              private errorService: ErrorsService) {}

  public get errorsHistory() {
    return this.errorService.HttpErrorResponsesHistory;
  }

  public clearHistory(): void {
    this.errorService.clearErrors();
    !this.historyLength && this._bottomSheetRef.dismiss();
  }

  private get historyLength(): number {
    return this.errorService.HttpErrorResponsesHistory.length;
  }

}
