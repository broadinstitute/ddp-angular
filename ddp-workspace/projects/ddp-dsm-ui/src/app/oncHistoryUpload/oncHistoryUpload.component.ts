import {Component, OnDestroy} from '@angular/core';
import { DSMService } from '../services/dsm.service';
import {finalize} from 'rxjs/operators';
import {SessionService} from '../services/session.service';
import {MatDialog} from '@angular/material/dialog';
import {LoadingModalComponent} from '../modals/loading-modal.component';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject, takeUntil} from "rxjs";

enum RequestStatus {
  SUCCESS,
  FAIL,
  DEFAULT
}

@Component({
  selector: 'app-onc-history-upload',
  templateUrl: 'oncHistoryUpload.component.html',
  styleUrls: ['oncHistoryUpload.component.scss']
})
export class OncHistoryUploadComponent implements OnDestroy {
  public requestStatus: RequestStatus = RequestStatus.DEFAULT;
  public errorMessage: string;
  public selectedTextFile: File;

  private subscriptionSubject = new Subject<void>();

  constructor(private readonly dsmService: DSMService,
              private readonly session: SessionService,
              private readonly dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  upload(): void {
    this.requestStatus = RequestStatus.DEFAULT;

    const tempDialog = this.dialog
      .open(LoadingModalComponent, {data: {message: 'Uploading, this may take a while'}, disableClose: true});

    this.dsmService.uploadOncHistoryTextFile(
      this.session.selectedRealm,
      this.selectedTextFile
    ).pipe(
      takeUntil(this.subscriptionSubject),
      finalize(() => tempDialog.close())
    )
      .subscribe({
        next: () => this.requestStatus = RequestStatus.SUCCESS,
        error: (error: any) => this.handleError(error)
      });
  }

  fileSelected(file: File): void {
    if (file.size > 31457280) {
      this.errorMessage = 'File size must be less than 30 MB';
    }
    this.selectedTextFile = file;
  }

  public downloadTemplateAndDirectory(): void {
    const tempDialog = this.dialog
      .open(LoadingModalComponent, {data: {message: 'Downloading... this may take a while'}, disableClose: true});

    this.dsmService.downloadOncHistoryTemplateAndDirectory(this.session.selectedRealm)
      .pipe(takeUntil(this.subscriptionSubject), finalize(() => tempDialog.close()))
      .subscribe({
        next: (arrayBuffer: ArrayBuffer) => {
          const blob = new Blob([arrayBuffer], {
            type: 'application/zip'
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error: (error: any) => this.handleError(error)
      })
  }

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.requestStatus = RequestStatus.FAIL;
      this.errorMessage = error.error;
    }
  }
}
