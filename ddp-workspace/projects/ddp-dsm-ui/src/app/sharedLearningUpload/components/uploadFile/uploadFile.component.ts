import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, OnDestroy,
  Output,
  ViewChild
} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";
import {SharedLearningsHTTPService} from "../../services/sharedLearningsHTTP.service";
import {Subscription} from "rxjs";
import {finalize} from "rxjs/operators";
import {UploadButtonText, UploadStatus} from "../../enums/browseFile-enums";
import {MatDialog} from "@angular/material/dialog";
import {LoadingModalComponent} from "../../../modals/loading-modal.component";

@Component({
  selector: 'app-browse-files',
  templateUrl: `uploadFile.component.html`,
  styleUrls: ['uploadFile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnDestroy {
  @ViewChild('hiddenInput', {static: true}) inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton: ElementRef<HTMLButtonElement>;

  public selectedFileName = 'No File';
  public uploadButtonText = UploadButtonText.UPLOAD;
  public isFileSelected: boolean = false;
  public uploadStatus: UploadStatus = UploadStatus.NONE;

  private subscription: Subscription;

  @Output() fileUploaded = new EventEmitter<SharedLearningsFile>()

  constructor(private readonly cdr: ChangeDetectorRef,
              private readonly sharedLearningsHTTPService: SharedLearningsHTTPService,
              private readonly matDialog: MatDialog) {
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  public browse(): void {
    this.inputElement.nativeElement.click()
  }

  public upload(): void {
    const files: FileList = this.inputElement.nativeElement.files;
    const file: File = files.item(0);
    this.cdr.markForCheck();
    this.updateUploadButton(UploadStatus.IN_PROGRESS);

    const openLoadingDialog = this.matDialog.open(LoadingModalComponent,
      {data: {message: `${file.name} is uploading. Please wait...`}, disableClose: true});

    this.subscription = this.sharedLearningsHTTPService
      .uploadFile(file)
      .pipe(finalize(() => openLoadingDialog.close()))
      .subscribe({
        next: () => {
          this.updateUploadButton(UploadStatus.SUCCESS);
          this.fileUploaded.emit({
            name: file.name,
            uploadDate: new Date()
          })
        }, error: () => {
          this.cdr.markForCheck();
          this.updateUploadButton(UploadStatus.FAIL);
        }
      })
  }

  public onFileSelection(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files;
    if (files.length) {
      this.selectedFileName &&= this.displayFileName(files.item(0).name);
      this.isFileSelected = true;
      this.uploadStatus = UploadStatus.NONE;
      this.uploadButtonText = UploadButtonText.UPLOAD;
    }
  }

  public retryOrNot(isMouseOver: boolean): void {
    if (this.uploadStatus === UploadStatus.FAIL || this.uploadStatus === UploadStatus.RETRY) {
      const currentStatus = isMouseOver ? UploadStatus.RETRY : UploadStatus.FAIL;
      this.updateUploadButton(currentStatus);
    }
  }

  private displayFileName(name: string): string {
    const splitName = name.trim().split('.');
    const fileExtension = splitName.slice(-1);
    const fileName = splitName.slice(0, -1).join('.');
    return `${fileName.length > 16 ? fileName.slice(0, 8) + ' ... ' + fileName.slice(-8) :
      fileName}.${fileExtension}`
  }

  private updateUploadButton(uploadStatus: UploadStatus) {
    switch (uploadStatus) {
      case  UploadStatus.SUCCESS:
        this.uploadStatus = UploadStatus.SUCCESS;
        this.uploadButtonText = UploadButtonText.UPLOAD_SUCCESS;
        break;
      case  UploadStatus.FAIL:
        this.uploadStatus = UploadStatus.FAIL;
        this.uploadButtonText = UploadButtonText.UPLOAD_FAIL;
        break;
      case  UploadStatus.IN_PROGRESS:
        this.uploadStatus = UploadStatus.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD_IN_PROGRESS;
        break;
      case  UploadStatus.RETRY:
        this.uploadStatus = UploadStatus.RETRY;
        this.uploadButtonText = UploadButtonText.UPLOAD_RETRY;
        break;
      default:
        this.uploadStatus = UploadStatus.NONE;
        this.uploadButtonText = UploadButtonText.UPLOAD;
        break;
    }
  }
}
