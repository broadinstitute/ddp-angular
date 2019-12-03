import { Component, Input } from '@angular/core';
import * as _ from 'underscore';

@Component({
    selector: 'ddp-validation-message',
    template: `
    <div *ngIf="message && message.length" class="ErrorMessage">
        <ul *ngIf="isArrayOfMessages() && message.length > 1; else singleMessage" class="ErrorMessageList">
            <li *ngFor="let item of message" class="ErrorMessageItem">
                <span [innerHTML]="item" routeTransformer></span>
            </li>
        </ul>
        <ng-template #singleMessage>
            <span [innerHTML]="isArrayOfMessages() ? message[0] : message" routeTransformer></span>
        </ng-template>
    </div>`
})
export class ValidationMessage {
  @Input() public message: string[] | string | null;

  public isArrayOfMessages(): boolean {
    return _.isArray(this.message);
  }

}
