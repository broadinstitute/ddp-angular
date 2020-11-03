import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ToolkitConfigurationService, JoinMailingListComponent } from 'toolkit';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  public email: string;
  public emailHref: string;

  constructor(
    private dialog: MatDialog,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.email = this.toolkitConfiguration.infoEmail;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
  }

  public openMailingDialog(): void {
    this.dialog.open(JoinMailingListComponent, {
      width: '740px',
      position: { top: '30px' },
      data: {},
      autoFocus: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
