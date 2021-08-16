import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Route } from '../../constants/Route';
import { MailingListModalComponent } from '../mailing-list-modal/mailing-list-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  Route = Route;

  constructor(private dialog: MatDialog) {}

  onBackToTopClick(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onMailingListClick(): void {
    this.openMailingListDialog();
  }

  private openMailingListDialog(): void {
    this.dialog.open(MailingListModalComponent, {
      width: '100%',
      maxWidth: '80rem',
      disableClose: true,
      autoFocus: false,
    });
  }
}
