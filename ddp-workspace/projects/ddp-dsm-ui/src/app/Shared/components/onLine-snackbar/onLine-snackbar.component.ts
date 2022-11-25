import {Component, Inject} from "@angular/core";
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {OnlineSnackbarModel} from "../../models/snackbar-models/online-snackbar.model";

@Component({
  selector: 'app-online-snackbar',
  templateUrl: './onLine-snackbar.component.html',
  styleUrls: ['./onLine-snackbar.component.scss'],
})
export class OnLineSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: OnlineSnackbarModel, private _snackRef: MatSnackBarRef<OnLineSnackbarComponent>) {
  }

  public refresh(): void {
    this._snackRef.dismiss();
    window.location.reload();
  }
}
