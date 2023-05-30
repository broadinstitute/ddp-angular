import {
  ChangeDetectionStrategy,
  Component, Input, OnDestroy, OnInit,
} from "@angular/core";
import {SharedLearningsFile} from "./interfaces/sharedLearningsFile";
import {EMPTY, iif, Observable, Subscription, switchMap, tap} from "rxjs";
import {SharedLearningsHTTPService} from "./services/sharedLearningsHTTP.service";

@Component({
  selector: 'app-shared-learnings-upload',
  templateUrl: 'sharedLearningsUpload.component.html',
  styleUrls: ['sharedLearningsUpload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedLearningsHTTPService]
})
export class SharedLearningsUploadComponent implements OnInit, OnDestroy {
  @Input() tabActivated: Observable<void>;
  public sharedLearningsFiles: SharedLearningsFile[];
  private subscription: Subscription

  constructor(private readonly sharedLearningsHTTPService: SharedLearningsHTTPService) {
  }

  ngOnInit(): void {
    this.subscription = this.getFiles.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onFileUpload(file: SharedLearningsFile): void {
    this.sharedLearningsFiles = [...this.sharedLearningsFiles, file]
  }

  private get getFiles(): Observable<any> {
    return this.tabActivated.pipe(
      switchMap(() => iif(() => !this.sharedLearningsFiles, this.sharedLearningsHTTPService.tempFiles, EMPTY)),
      tap((files: SharedLearningsFile[]) => this.sharedLearningsFiles = files)
    )
  }

}
