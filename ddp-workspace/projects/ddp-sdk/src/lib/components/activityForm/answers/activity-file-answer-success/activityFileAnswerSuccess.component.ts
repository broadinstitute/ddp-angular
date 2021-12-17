import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'ddp-activity-file-answer-success',
  template: '<p *ngIf="showMessage() | async" class="success-message">{{ SUCCESS_KEY | translate }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFileAnswerSuccess {
  readonly SUCCESS_KEY = 'SDK.FileUpload.Success';

  constructor(
    private readonly translateService: TranslateService
  ) {}

  showMessage(): Observable<boolean> {
    return this.hasTranslation(this.SUCCESS_KEY);
  }

  private hasTranslation(key: string): Observable<boolean> {
    return this.translateService.get(key).pipe(
      map((translation: string) => translation !== key && translation !== '')
    );
  }
}
