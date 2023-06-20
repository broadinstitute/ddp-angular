import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import {SomaticResultsFile} from './interfaces/somaticResultsFile';
import {Observable, Subscription, switchMap, takeWhile, tap, throwError} from 'rxjs';
import {SharedLearningsHTTPService} from './services/sharedLearningsHTTP.service';
import {catchError, filter, finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

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

  private subscription: Subscription;

  @Input() tabActivated: Observable<void>;
  @Input() participantId: string;

  constructor(private readonly sharedLearningsHTTPService: SharedLearningsHTTPService) {}

  ngOnInit(): void {
    this.subscription = this.loadFiles.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onFileUpload(file: SomaticResultsFile): void {
    this.somaticResultsFiles = [...this.somaticResultsFiles, file];
  }

  private get loadFiles(): Observable<any> {
    this.isLoading = true;
    return this.tabActivated.pipe(
      switchMap(() => this.sharedLearningsHTTPService.getFiles(this.participantId)),
      tap((somaticResultsFiles: SomaticResultsFile[]) =>
        this.somaticResultsFiles = somaticResultsFiles.filter((somaticFile: SomaticResultsFile) => !somaticFile.deletedByUserId)),
      takeWhile(() => !(!!this.somaticResultsFiles) || !!this.errorLoadingData),
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse) {
          this.errorLoadingData = err.error;
          this.isUnauthorized = err.status === 403;
        }
        return throwError(() => err);
      }),
      finalize(() => this.isLoading = false)
    );
  }

}
