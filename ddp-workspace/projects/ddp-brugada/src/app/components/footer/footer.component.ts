import { Component } from '@angular/core';

import { Route } from '../../constants/Route';
import { MailingListService } from '../../services/mailing-list.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [MailingListService],
})
export class FooterComponent {
  Route = Route;
  public pdfUrl = 'https://storage.googleapis.com/cmi-study-dev-assets/brugada/pdf/For_Physicians_v2.pdf';

  constructor(private mailingListService: MailingListService) {}

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
    this.mailingListService.openDialog();
  }
}
