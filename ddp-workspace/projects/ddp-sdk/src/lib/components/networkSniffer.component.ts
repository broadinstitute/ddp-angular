import { Component } from '@angular/core';
import { CommunicationAspect } from '../services/communicationAspect.service';
import { NetworkingMock } from '../models/networkingMock';
import { MatDialog } from '@angular/material/dialog';
import { NewRequestMock } from './newRequestMock.component';

@Component({
  selector: 'ddp-network-sniffer',
  template: `
    <button mat-button (click)="openDialog()" data-ddp-test="addSnifferUrlButton">ADD</button>
    <div *ngFor="let feed of feeds">
      <p matLine class="subheading-1">
        <mat-slide-toggle [(ngModel)]="feed.mocked"
                          style="margin: 10px"
                          [attr.data-ddp-test]="'snifferedUrl::' + feed.key">
        </mat-slide-toggle>
        {{ feed.key }}
        <button mat-icon-button
                (click)="remove(feed.key)"
                [attr.data-ddp-test]="'removeSnifferedUrlButton::' + feed.key">
          <mat-icon>clear</mat-icon>
        </button>
      </p>
      <mat-card *ngIf="feed.mocked" [attr.data-ddp-test]="'mockSettings::' + feed.key">
        <p>
          <mat-slide-toggle [(ngModel)]="feed.returnNull"
                            style="margin: 10px"
                            [attr.data-ddp-test]="'mockSettings::returnNull::' + feed.key">
            Return null
          </mat-slide-toggle>
          <mat-form-field>
            <mat-select [disabled]="feed.returnNull"
                        placeholder="HTTP code"
                        [(value)]="feed.mockedCode"
                        [attr.data-ddp-test]="'mockSettings::httpCode::' + feed.key">
              <mat-option *ngFor="let code of feed.supportedCodes"
                          [value]="code"
                          [attr.data-ddp-test]="'mockSettings::httpCode::' + feed.key + '::' + code">
                {{code}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-icon color="warn" class="material-icons.md-18"
                    matTooltip="This will be thrown as exception"
                    *ngIf="feed.mockedCode != 200 && !feed.returnNull">
            warning
          </mat-icon>
        <p>
          <textarea cols="80"
                  [disabled]="feed.returnNull"
                  rows="15"
                  [(ngModel)]="feed.mock"
                  [attr.data-ddp-test]="'mockSettings::json::' + feed.key">
          </textarea>
        </p>
      </mat-card>
    </div>`
})
export class NetworkSnifferComponent {
  constructor(private dialog: MatDialog) { }

  public get feeds(): Array<NetworkingMock> {
    return CommunicationAspect.interceptedFeeds;
  }

  public remove(key: string): void {
    CommunicationAspect.interceptedFeeds = CommunicationAspect.interceptedFeeds.filter(x => x.key !== key);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(NewRequestMock, {
      width: '800px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
