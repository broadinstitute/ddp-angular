import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import {SomaticResultsFile} from './interfaces/somaticResultsFile';
import {
  Observable,
  Subject,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
  throwError
} from 'rxjs';
import {SharedLearningsHTTPService} from './services/sharedLearningsHTTP.service';
import {catchError, finalize} from 'rxjs/operators';
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

  private takeUntilSubject$ = new Subject<void>();

  @Input() tabActivated$: Observable<void>;
  @Input() participantId: string;

  constructor(
    private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
  ) {}

  ngOnInit(): void {
    this.initialLoad
      .pipe(takeUntil(this.takeUntilSubject$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.takeUntilSubject$.next();
    this.takeUntilSubject$.complete();
  }

  public onFileUpload(somaticResultsFiles: SomaticResultsFile): void {
    this.somaticResultsFiles = [...this.somaticResultsFiles, somaticResultsFiles];
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
    return somaticResultsFiles.filter((somaticFile: SomaticResultsFile) => !(!!somaticFile.deletedByUserId));
  }

  private handleError(error: any): Observable<any> {
    if(error instanceof HttpErrorResponse) {
      this.errorLoadingData = error.error;
      this.isUnauthorized = error.status === 403;
    }
    return throwError(() => error);
  }

}
