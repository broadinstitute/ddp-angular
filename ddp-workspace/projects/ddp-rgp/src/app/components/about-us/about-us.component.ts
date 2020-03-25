import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AboutUsDialogComponent } from './dialog/about-us-dialog.component';
import { DialogData } from './dialogData';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  constructor(private dialog: MatDialog) { }

  public openDialog(data: DialogData) {
    this.dialog.open(AboutUsDialogComponent, {
      data,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
