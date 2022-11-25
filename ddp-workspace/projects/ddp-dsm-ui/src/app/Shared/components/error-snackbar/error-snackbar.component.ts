import {Component, Inject, OnInit} from "@angular/core";
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.scss']
})

export class ErrorSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: HttpErrorResponse, private _snackRef: MatSnackBarRef<ErrorSnackbarComponent>) {
  }

  ngOnInit() {
    console.log(this.data, 'ERROR OBJECT')
  }

  public close(): void {
    this._snackRef.dismiss();
  }

}
