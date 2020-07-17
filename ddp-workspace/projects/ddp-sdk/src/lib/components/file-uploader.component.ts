import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'ddp-file-uploader',
  template: `
    <div>
      <input #fileInput
             style="display: none"
             type="file"
             [name]="name"
             [attr.required]="isRequired"
             [accept]="allowedExtensions"
             (change)="onFileSelected()">
      <button mat-raised-button color="primary" class="file-select-button" (click)="onChooseFileClick()" type="button">
        <mat-icon>attach_file</mat-icon>
        {{buttonText}}
      </button>
      <p class="file-name" *ngIf="!file; else fileName">{{hintText}}</p>
      <ng-template #fileName>
        <p class="file-name">{{ file?.name }}</p>
      </ng-template>
    </div>
`,
  styles: [`
    .file-select-button, .file-name {
      display: inline-block;
      margin: 8px;
    }
  `]
})

export class FileUploaderComponent {
  @Output() fileChange = new EventEmitter<File>();
  @Input() name: string;
  @Input() allowedExtensions: string;
  @Input() isRequired: boolean;
  @Input() buttonText = 'Choose file';
  @Input() hintText = 'No file chosen';

 @ViewChild('fileInput',  { static: false }) fileInput;

  private _file: File | null = null;
  get file(): File {
    return this._file;
  }
  set file(value: File | null) {
    this._file = value;
    this.fileChange.emit(this._file);
  }

  onFileSelected(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  onChooseFileClick(): void {
    this.fileInput.nativeElement.click();
  }
}
