import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import {SomaticResultsFile} from './interfaces/somaticResultsFile';
import {Observable, Subject, switchMap, takeUntil, takeWhile, tap, throwError} from 'rxjs';
import {SharedLearningsHTTPService} from './services/sharedLearningsHTTP.service';
import {catchError, finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoadingModalComponent} from '../modals/loading-modal.component';
import {UploadedFileShortInfo} from './interfaces/helperInterfaces';

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedLearningsHTTPService]
})
export class SharedLearningsUploadComponent implements OnInit, OnDestroy {
  public somaticResultsFiles: SomaticResultsFile[] | null;
  public isLoading = false;
  public isUnauthorized = false;
  public errorLoadingData: string | null;

  private takeUntilSubject$ = new Subject<void>();

  @Input() tabActivated$: Observable<void>;
  @Input() participantId: string;

  constructor(
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
    private readonly matDialog: MatDialog) {}

  ngOnInit(): void {
    this.initialLoad
      .pipe(takeUntil(this.takeUntilSubject$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.takeUntilSubject$.complete();
    this.takeUntilSubject$.unsubscribe();
  }

  public onFileUpload({fileName, somaticDocumentId}: UploadedFileShortInfo): void {
    // @TODO long polling once virus scan is on place
    const openDialog: MatDialogRef<any> = this.openLoadingDialog(fileName);

    this.getSomaticResultsFiles
      .pipe(
        takeUntil(this.takeUntilSubject$),
        finalize(() => openDialog.close())
      )
      .subscribe({
        next: (somaticResultsFiles: SomaticResultsFile[]) =>
          this.somaticResultsFiles = this.filterDeletedFiles(somaticResultsFiles),
        error: (error: any) => this.handleError(error)
      });
  }

  private get initialLoad(): Observable<any> {
    return this.tabActivated$.pipe(
      switchMap(() => this.getSomaticResultsFiles),
      tap((somaticResultsFiles: SomaticResultsFile[]) =>
        this.somaticResultsFiles = this.filterDeletedFiles(somaticResultsFiles)),
      takeWhile(() => !(!!this.somaticResultsFiles) || !!this.errorLoadingData),
      catchError((error: any) => this.handleError(error)),
    );
  }

  private get getSomaticResultsFiles(): Observable<SomaticResultsFile[]> {
    this.isLoading = true;
    return this.sharedLearningsHTTPService.getFiles(this.participantId)
      .pipe(finalize(() => this.isLoading = false));
  }

  private filterDeletedFiles(somaticResultsFiles: SomaticResultsFile[]): SomaticResultsFile[] {
    return somaticResultsFiles.filter((somaticFile: SomaticResultsFile) => !somaticFile.deletedByUserId);
  }

  private openLoadingDialog(fileName: string): MatDialogRef<LoadingModalComponent> {
    return this.matDialog.open(LoadingModalComponent,
      {data: {message: `The file (${fileName}) is undergoing virus scanning`}, disableClose: true});
  }

  private handleError(error: any): Observable<any> {
    if(error instanceof HttpErrorResponse) {
      this.errorLoadingData = error.error;
      this.isUnauthorized = error.status === 403;
    }
    return throwError(() => error);
  }

}
