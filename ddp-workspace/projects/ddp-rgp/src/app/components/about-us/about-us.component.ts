import { Component } from '@angular/core';
// import { AboutUsService } from './about-us.service';
// import { MdDialogRef } from '@angular/material';
// import { AboutUsDialogsComponent } from './about-us-dialogs/about-us-dialogs.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  // public result: any;
  // dialogRef: MdDialogRef<AboutUsDialogsComponent>;

  // constructor(private dialogsService: AboutUsService) { }

  public openDialog(id) {
    // this.dialogsService
    //   .showDetails(id)
    //   .subscribe(res => this.result = res);
  }
}
