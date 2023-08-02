import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
  selector: 'app-error-message',
  template: `
        <div class="error" *ngIf="errorText">
          <p class="error-text">{{errorText}}</p>
          <ng-container *ngIf="errorMessage">
            <mat-divider></mat-divider>
            <p class="error-message">Error message: <br/><span class="error-message-text">{{errorMessage}}</span></p>
          </ng-container>
        </div>
  `,
  styles: [`
    p {
      margin: 0;
      padding: 0;
    }
    mat-divider {
      margin: .5em 0;
    }
    .error {
      width: 50%;
      margin: .5em;
      background-color: rgba(230, 57, 70, 0.49);
      border-radius: 1em;
      padding: 1em;
      text-align: center;
      font-family:  Montserrat-SemiBold, sans-serif;
    }
    .error-message {
      font-family:  Montserrat-Regular, sans-serif;
    }
    .error-message-text {
      font-family:  Montserrat-SemiBold, sans-serif;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {
  @Input() errorText: string;
  @Input() errorMessage: string;
}
