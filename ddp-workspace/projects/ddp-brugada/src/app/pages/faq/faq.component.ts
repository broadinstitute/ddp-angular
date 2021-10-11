import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import { MailingListService } from '../../services/mailing-list.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  providers: [MailingListService],
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  constructor(private mailingListService: MailingListService) {}

  ngAfterViewInit(): void {
    this.mailingListService.applyEventListeners();
  }

  ngOnDestroy(): void {
    this.mailingListService.removeEventListeners();
  }
}
