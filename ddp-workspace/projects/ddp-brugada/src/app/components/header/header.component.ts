import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Route } from '../../constants/Route';
import { MailingListService } from '../../services/mailing-list.service';
import { filter, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MailingListService],
})
export class HeaderComponent implements OnInit {
  Route = Route;
  private _isNavigationShown = false;
  public pdfUrl = 'https://storage.googleapis.com/cmi-study-dev-assets/brugada/pdf/for-physicians.pdf';

  constructor(
    private readonly router: ActivatedRoute,
    private readonly mailingListService: MailingListService
  ) {}

  ngOnInit(): void {
    this.handleParamsForMailingList();
  }

  get isNavigationShown(): boolean {
    return this._isNavigationShown;
  }

  set isNavigationShown(isShown) {
    if (isShown) {
      // Prevent scrolling on body when navigation is shown
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    this._isNavigationShown = isShown;
  }

  onToggleClick(): void {
    this.isNavigationShown = !this.isNavigationShown;
  }

  onNavClick(e: MouseEvent): void {
    const clickTarget = e.target as HTMLElement;
    const tagName = clickTarget.tagName.toLowerCase();

    if (['a', 'button'].includes(tagName)) {
      this.isNavigationShown = false;
    }
  }

  openMailingListModal(): void {
    this.mailingListService.openDialog();
  }

  private handleParamsForMailingList(): void {
    this.router.queryParams.pipe(
      filter((params: Params) => !!Object.keys(params).length),
      first(),
      filter(({ joinMailingList }: Params) => !!joinMailingList),
      tap(() => this.openMailingListModal())
    ).subscribe();
  }
}
