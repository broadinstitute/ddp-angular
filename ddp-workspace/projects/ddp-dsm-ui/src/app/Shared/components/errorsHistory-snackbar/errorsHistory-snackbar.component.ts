import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {ErrorsService} from '../../../services/errors.service';
import {IHttpErrorResponseHistoryItem} from '../../interfaces/IHttpErrorResponseHistoryItem';

@Component({
  selector: 'app-errors-history-snackbar',
  templateUrl: './errorsHistory-snackbar.component.html',
  styleUrls: ['./errorsHistory-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsHistorySnackbarComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<ErrorsHistorySnackbarComponent>,
              private errorService: ErrorsService) {}

  public get errorsHistory(): IHttpErrorResponseHistoryItem[] {
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
