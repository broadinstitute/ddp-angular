import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NGXTranslateService } from 'ddp-sdk';
import { map, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'toolkit-redirect-to-login-landing',
  template: `
      <ng-container *ngIf="errorText || errorText === ''; then error else auth0">
      </ng-container>
      <ng-template #auth0>
        <ddp-redirect-to-auth0-login>
            <toolkit-common-landing></toolkit-common-landing>
        </ddp-redirect-to-auth0-login>
      </ng-template>
      <ng-template #error>
        <toolkit-error [errorText]="errorText"></toolkit-error>
      </ng-template>
  `
})

export class RedirectToLoginLandingComponent implements OnInit {
  public errorText: string;

  constructor(
    private route: ActivatedRoute,
    private translate: NGXTranslateService) { }

  public ngOnInit(): void {
    const translateKey = 'Toolkit.ErrorCodes.';
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.get('errorCode')),
      filter(code => code !== null),
      mergeMap(code => this.translate.getTranslation(`${translateKey}${code}`))
    ).subscribe((errorMessage: string) => {
      this.errorText = errorMessage.indexOf(translateKey) !== -1 ? '' : errorMessage;
    });
  }
}
