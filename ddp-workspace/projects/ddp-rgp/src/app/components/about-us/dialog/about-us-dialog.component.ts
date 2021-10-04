import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from 'ddp-sdk';
import { DialogData } from '../../../models/dialogData.model';

@Component({
  selector: 'app-about-us-dialog',
  templateUrl: './about-us-dialog.component.html',
  styleUrls: ['./about-us-dialog.component.scss'],
})
export class AboutUsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AboutUsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly languageService: LanguageService,
  ) {}

  public get imageUrl(): string {
    return `/assets/images/about-us/members/${this.data.image}`;
  }

  public get name(): string {
    if (this.languageService.getCurrentLanguage() === 'es') {
      return this.data.name;
    }

    if (this.data.degree) {
      return `${this.data.name}, ${this.data.degree}`;
    }

    return this.data.name;
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
