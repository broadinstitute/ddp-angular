import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Output,
  ViewChild
} from "@angular/core";
import {SharedLearningsFile} from "../../interfaces/sharedLearningsFile";

enum UploadButtonText {
  UPLOAD = 'Upload',
  UPLOAD_SUCCESS = 'Uploaded',
  UPLOAD_FAIL = 'Upload failed',
  UPLOAD_IN_PROGRESS = 'Uploading...',
  UPLOAD_RETRY = 'Retry'
}

enum UploadStatus {
  NONE,
  SUCCESS,
  FAIL,
  IN_PROGRESS,
  RETRY
}

@Component({
  selector: 'app-browse-files',
  templateUrl: `browseFile.component.html`,
  styleUrls: ['browseFile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseFileComponent {
  @ViewChild('hiddenInput', {static: true}) inputElement: ElementRef<HTMLInputElement>;
  @ViewChild('uploadButton') uploadButton: ElementRef<HTMLButtonElement>;

  public selectedFileName = 'No File';
  public uploadButtonText = UploadButtonText.UPLOAD;
  public isLoading: boolean = false;
  public isFileSelected: boolean = false;
  public uploadStatus: UploadStatus = UploadStatus.NONE;

  @Output() fileUploaded = new EventEmitter<SharedLearningsFile>()

  constructor(private cdf: ChangeDetectorRef) {}


  public browse(): void {
    this.inputElement.nativeElement.click()
  }

  public upload() {
    const files: FileList = this.inputElement.nativeElement.files;
    const file: File = files.item(0);
    this.cdf.markForCheck();
    this.isLoading = true
    console.log(file)
    /**
     * @TODO integrate backend call
     */

    this.updateUploadButton(UploadStatus.IN_PROGRESS);
    setTimeout(() => {
      this.cdf.markForCheck();
      this.isLoading = false
      let random = Math.floor(Math.random() * 2)
      this.updateUploadButton(!random ? UploadStatus.FAIL : UploadStatus.SUCCESS);
      if(this.uploadStatus === UploadStatus.SUCCESS) {
        this.fileUploaded.emit({
          name: file.name,
          uploadDate: new Date()
        })
      }
    }, 3000)
  }

  public onFileSelection(event: Event) {
    this.cdf.markForCheck();
    const files: FileList = (event.target as HTMLInputElement).files;
    if(files.length) {
      this.selectedFileName &&= this.displayFileName(files.item(0).name);
      this.isFileSelected = true;
      this.uploadStatus = UploadStatus.NONE;
      this.uploadButtonText = UploadButtonText.UPLOAD;
    }
  }

  public retryOrNot(isMouseOver: boolean): void {
    if(this.uploadStatus === UploadStatus.FAIL || this.uploadStatus === UploadStatus.RETRY) {
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
    switch(uploadStatus) {
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
