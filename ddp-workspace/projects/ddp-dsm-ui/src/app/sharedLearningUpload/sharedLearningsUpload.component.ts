import {
  ChangeDetectionStrategy,
  Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
} from "@angular/core";
import {SharedLearningsFile} from "./interfaces/sharedLearningsFile";
import {defaultIfEmpty, EMPTY, iif, Observable, of, Subscription, switchMap, tap, throwError} from "rxjs";
import {SharedLearningsHTTPService} from "./services/sharedLearningsHTTP.service";
import {catchError, finalize, take} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedLearningsHTTPService]
})
export class SharedLearningsUploadComponent implements OnInit, OnDestroy, OnChanges {
  public sharedLearningsFiles: SharedLearningsFile[] | null;
  public isLoading: boolean = false;
  public isUnauthorized: boolean = false;
  public errorLoadingData: string | null;

  private subscription: Subscription;

  @Input() tabActivated: Observable<void>;
  @Input() participantId: string;


  constructor(private readonly sharedLearningsHTTPService: SharedLearningsHTTPService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes, 'SHARED_LEARNING_PARTICIPANT_ID')
  }

  ngOnInit(): void {
    this.subscription = this.loadFiles.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onFileUpload(file: SharedLearningsFile): void {
    this.sharedLearningsFiles = [...this.sharedLearningsFiles, file]
  }

  private get loadFiles(): Observable<any> {
    this.isLoading = true;
    return this.tabActivated.pipe(
      switchMap(() => iif(() => !(!!this.sharedLearningsFiles) || !!this.errorLoadingData,
        this.sharedLearningsHTTPService.getFiles(this.participantId), of(null))),
      tap((files: SharedLearningsFile[]) => {
        console.log(files, 'FILES')
        this.sharedLearningsFiles = files || null;
      }),
      take(1),
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse) {
          this.errorLoadingData = err.error;
          this.isUnauthorized = err.status === 403;
        }
        return throwError(() => err);
      }),
      finalize(() => this.isLoading = false)
    )
  }

}
