import { Component } from '@angular/core';
import { DSMService } from '../services/dsm.service';
import {finalize} from 'rxjs/operators';
import {SessionService} from '../services/session.service';
import {MatDialog} from '@angular/material/dialog';
import {LoadingModalComponent} from '../modals/loading-modal.component';
import {HttpErrorResponse} from '@angular/common/http';

enum UploadStatus {
  SUCCESS,
  FAIL,
  DEFAULT
}

@Component({
  selector: 'app-onc-history-upload',
  templateUrl: 'oncHistoryUpload.component.html',
  styleUrls: ['oncHistoryUpload.component.scss']
})
export class OncHistoryUploadComponent {
  public uploadStatus: UploadStatus = UploadStatus.DEFAULT;
  public errorMessage: string;
  public selectedTextFile: File;

  constructor(private readonly dsmService: DSMService,
              private readonly session: SessionService,
              private readonly dialog: MatDialog) {}


  upload(): void {
    this.uploadStatus = UploadStatus.DEFAULT;

    const tempDialog = this.dialog
      .open(LoadingModalComponent, {data: {message: 'Uploading, this may take a while'}, disableClose: true});

    this.dsmService.uploadOncHistoryTextFile(
      this.session.selectedRealm,
      this.selectedTextFile
    ).pipe(
      finalize(() => tempDialog.close())
    )
      .subscribe({
        next: () => this.uploadStatus = UploadStatus.SUCCESS,
        error: (error: any) => {
          if (error instanceof HttpErrorResponse) {
            console.log(error);
            this.uploadStatus = UploadStatus.FAIL;
            this.errorMessage = error.error;
          }
        },
      });
  }

  fileSelected(file: File): void {
    if (file.size > 31457280) {
      this.errorMessage = 'File size must be less than 30 MB';
    }
    this.selectedTextFile = file;
  }
}
