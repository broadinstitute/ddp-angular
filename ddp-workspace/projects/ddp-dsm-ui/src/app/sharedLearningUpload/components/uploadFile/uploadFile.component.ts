import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, Input, OnDestroy,
  Output,
  ViewChild
} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";
import {SharedLearningsHTTPService} from "../../services/sharedLearningsHTTP.service";
import {delay, of, Subscription} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {UploadButtonText} from "../../enums/uploadButtonText-enum";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LoadingModalComponent} from "../../../modals/loading-modal.component";
import {HttpRequestStatusEnum} from "../../enums/httpRequestStatus-enum";

@Component({
  selector: 'app-upload-files',
  templateUrl: `uploadFile.component.html`,
  styleUrls: ['uploadFile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnDestroy {
  @Input() participantId: string;
  @Input() unauthorized: boolean = false;
  @Output() fileUploaded = new EventEmitter<SharedLearningsFile>()

  @ViewChild('hiddenInput', {static: true}) inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton: ElementRef<HTMLButtonElement>;

  public selectedFileName = 'No File';
  public uploadButtonText = UploadButtonText.UPLOAD;
  public isFileSelected: boolean = false;
  public uploadStatus: HttpRequestStatusEnum = HttpRequestStatusEnum.DEFAULT;

  private subscription: Subscription;

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
              private readonly matDialog: MatDialog) {
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public browse(): void {
    this.inputElement.nativeElement.click();
  }

  public upload(): void {
    const files: FileList = this.inputElement.nativeElement.files;
    const file: File = files.item(0);
    this.cdr.markForCheck();
    this.updateUploadButton(HttpRequestStatusEnum.IN_PROGRESS);

    const openLoadingDialog = this.openLoadingDialog(file.name);

    this.subscription = this.sharedLearningsHTTPService
      .uploadFile(this.participantId, file)
      .pipe(
        delay(2000), // @TODO it's mocked delay
        // catchError(() => of(true)), // @TODO it's mocked data
        finalize(() => openLoadingDialog.close())
      )
      .subscribe({
        next: () => {
          this.updateUploadButton(HttpRequestStatusEnum.SUCCESS);
          this.fileUploaded.emit({
            name: file.name,
            uploadDate: new Date(),
            sentDate: new Date()
          })
        }, error: () => {
          this.cdr.markForCheck();
          this.updateUploadButton(HttpRequestStatusEnum.FAIL);
        }
      })
  }

  public onFileSelection(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files;
    if (files.length) {
      this.selectedFileName &&= this.displayFileName(files.item(0).name);
      this.isFileSelected = true;
      this.uploadStatus = HttpRequestStatusEnum.DEFAULT;
      this.uploadButtonText = UploadButtonText.UPLOAD;
    }
  }

  public retryOrNot(isMouseOver: boolean): void {
    if (this.uploadStatus === HttpRequestStatusEnum.FAIL || this.uploadStatus === HttpRequestStatusEnum.RETRY) {
      const currentStatus = isMouseOver ? HttpRequestStatusEnum.RETRY : HttpRequestStatusEnum.FAIL;
      this.updateUploadButton(currentStatus);
    }
  }

  private openLoadingDialog(fileName: string): MatDialogRef<LoadingModalComponent> {
    return this.matDialog.open(LoadingModalComponent,
      {data: {message: `${fileName} is uploading. Please wait...`}, disableClose: true});
  }

  private displayFileName(name: string): string {
    const splitName = name.trim().split('.');
    const fileExtension = splitName.slice(-1);
    const fileName = splitName.slice(0, -1).join('.');
    return `${fileName.length > 16 ? fileName.slice(0, 8) + ' ... ' + fileName.slice(-8) :
      fileName}.${fileExtension}`
  }

  private updateUploadButton(uploadStatus: HttpRequestStatusEnum) {
    switch (uploadStatus) {
      case  HttpRequestStatusEnum.SUCCESS:
        this.uploadStatus = HttpRequestStatusEnum.SUCCESS;
        this.uploadButtonText = UploadButtonText.UPLOAD_SUCCESS;
        break;
      case  HttpRequestStatusEnum.FAIL:
        this.uploadStatus = HttpRequestStatusEnum.FAIL;
        this.uploadButtonText = UploadButtonText.UPLOAD_FAIL;
        break;
      case  HttpRequestStatusEnum.IN_PROGRESS:
        this.uploadStatus = HttpRequestStatusEnum.DEFAULT;
        this.uploadButtonText = UploadButtonText.UPLOAD_IN_PROGRESS;
        break;
      case  HttpRequestStatusEnum.RETRY:
        this.uploadStatus = HttpRequestStatusEnum.RETRY;
        this.uploadButtonText = UploadButtonText.UPLOAD_RETRY;
        break;
      default:
        this.uploadStatus = HttpRequestStatusEnum.DEFAULT;
        this.uploadButtonText = UploadButtonText.UPLOAD;
        break;
    }
  }
}
