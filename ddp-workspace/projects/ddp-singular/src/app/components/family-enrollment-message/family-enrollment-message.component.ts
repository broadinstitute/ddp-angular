import { Component, OnDestroy, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { delay, of, Subject, takeUntil } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-family-enrollment-message',
  templateUrl: './family-enrollment-message.component.html',
  styleUrls: ['./family-enrollment-message.component.scss']
})
export class FamilyEnrollmentMessageComponent implements OnInit, OnDestroy {
  copied = false;
  readonly CONTENT = 'FamilyEnrollmentMessage.Content';
  private readonly NEW_LINE_SEPARATOR = '\n';
  private contentToCopy: string;
  private destroy = new Subject<void>();

  constructor(
    private clipboard: Clipboard,
    private readonly translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.contentToCopy = this.translateService.instant(this.CONTENT)
      .map((block: { text: string }) => block.text)
      .join(this.NEW_LINE_SEPARATOR);
  }

  copyContent(): void {
    of(this.contentToCopy).pipe(
      filter(content => !!content),
      takeUntil(this.destroy),
      tap((data: string) => {
        this.clipboard.copy(data);
        this.copied = true;
      }),
      delay(1500),
      tap(_ => {
        this.copied = false;
      }),
      catchError((err: any) => {
        console.log('An error trying to copy a family enrollment message', err);
        return of(err);
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}


