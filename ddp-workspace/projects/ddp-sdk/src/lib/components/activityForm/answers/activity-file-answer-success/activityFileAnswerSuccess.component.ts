import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'ddp-activity-file-answer-success',
  template: '<p *ngIf="showMessage()" class="success-message">{{ SUCCESS_KEY | translate }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityFileAnswerSuccess {
  readonly SUCCESS_KEY = 'SDK.FileUpload.Success';

  constructor(
    private readonly translateService: TranslateService
  ) {}

  showMessage(): boolean {
    return this.hasTranslation(this.SUCCESS_KEY);
  }

  private hasTranslation(key: string): boolean {
    const translation: string = this.translateService.instant(key);
    return translation !== key && translation !== '';
  }
}
