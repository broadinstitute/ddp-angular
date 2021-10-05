import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsDialogData } from '../../interfaces/notifications';


@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.scss']
})
export class NotificationsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NotificationsDialogData
  ) {}
}
