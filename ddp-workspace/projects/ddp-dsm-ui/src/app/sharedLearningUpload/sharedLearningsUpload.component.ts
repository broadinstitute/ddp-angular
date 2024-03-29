import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import {SomaticResultsFile, SomaticResultsFileWithStatus} from './interfaces/somaticResultsFile';
import {
  mergeMap,
  Observable,
  Subject, switchMap,
  takeUntil,
  tap, throwError,
} from 'rxjs';
import {SharedLearningsHTTPService} from './services/sharedLearningsHTTP.service';
import {catchError, filter, finalize, first, take} from 'rxjs/operators';
import {SharedLearningsStateService} from './services/sharedLearningsState.service';
import {MatDialog} from '@angular/material/dialog';
import {RoleService} from '../services/role.service';
import {ConfirmationModalComponent} from '../Shared/components/confirmationModal/confirmationModal.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedLearningsHTTPService, SharedLearningsStateService]
})
export class SharedLearningsUploadComponent implements OnInit, OnDestroy {
  public somaticResultsFilesWithStatus$: Observable<SomaticResultsFileWithStatus[]>;

  public isLoading = false;
  public displayedError: string | null = null;

  private takeUntilSubject$ = new Subject<void>();

  @Input() tabActivated$: Observable<void>;
  @Input() participantId: string;

  constructor(
    private readonly stateService: SharedLearningsStateService,
    private readonly matDialog: MatDialog,
    private readonly roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.somaticResultsFilesWithStatus$ = this.stateService.somaticResultsFiles$;
    this.loadData().subscribe();
  }

  ngOnDestroy(): void {
    this.stateService.unsubscribe();
    this.takeUntilSubject$.next();
    this.takeUntilSubject$.complete();
  }

  /* Initial Load */
  private loadData(): Observable<any> {
    this.isLoading = true;
    return this.tabActivated$.pipe(
      first(),
      switchMap(() => this.stateService.getAndScanFiles(this.participantId)
        .pipe(
          tap(() => this.displayedError = null),
          finalize(() => this.isLoading = false)
        )
      ),
      tap(() => this.isLoading = false),
      takeUntil(this.takeUntilSubject$),
      catchError((error: any) => this.handleError(error))
    );
  }

  /* Event Listeners */
  public onFileUpload(somaticResultsFiles: SomaticResultsFile): void {
    this.stateService.addFile(somaticResultsFiles, this.participantId);
  }

  public onSendToParticipant({somaticDocumentId}: SomaticResultsFileWithStatus): void {
    this.stateService.sendFileToParticipant(this.participantId, somaticDocumentId)
      .pipe(takeUntil(this.takeUntilSubject$))
      .subscribe();
  }

  public onDeleteFile({somaticDocumentId, fileName}: SomaticResultsFileWithStatus): void {
    const activeConfirmationDialog = this.matDialog
      .open(ConfirmationModalComponent, {data: {name: fileName}, width: '500px'});

    activeConfirmationDialog.afterClosed()
      .pipe(
        filter((answer: boolean) => answer),
        mergeMap(() => this.stateService.deleteFile(somaticDocumentId)),
        take(1),
        takeUntil(this.takeUntilSubject$)
      ).subscribe();
  }

  /* Template functions*/
  public get allowToSeeTitle(): boolean {
    return this.roleService.allowUploadRorFile;
  }

  /** Handlers */
  private handleError(error: any): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      this.displayedError = error.error;
    }
    return throwError(() => error);
  }


}
