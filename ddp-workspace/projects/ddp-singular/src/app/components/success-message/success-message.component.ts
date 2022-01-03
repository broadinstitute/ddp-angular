import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, first, pluck, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SuccessMessageDialogComponent } from '../success-message-dialog/success-message-dialog.component';


@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessMessageComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      pluck('success'),
      filter((value: string) => value === 'true'),
      first(),
      tap(() => this.dialog.open(SuccessMessageDialogComponent))
    ).subscribe();
  }
}
