import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filepicker',
  templateUrl: './field-filepicker.component.html',
  styleUrls: ['./field-filepicker.component.css']
})
export class FieldFilepickerComponent {
  @Input() id: string;
  @Input() fileFormat: string;
  @Output() fileSelected = new EventEmitter();

  error: string = null;
  file: File = null;

  userFile(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files;
    if (this.fileFormat === '*') {
      this.file = files[0];
      this.fileSelected.emit(this.file);
      this.error = null;
    } else if (this.fileFormat === 'image') {
      if (files[0].name.endsWith('png') || files[0].name.endsWith('jpg')) {
        this.file = files[0];
        this.fileSelected.emit(this.file);
        this.error = null;
      } else {
        this.error = 'Wrong file type selected. Please select a png or jpg file.';
      }
    } else {
      if (files[0].type === 'text/plain') {
        this.file = files[0];
        this.fileSelected.emit(this.file);
        this.error = null;
      } else {
        this.error = 'Wrong file type selected. Please select a txt file.';
      }
    }
  }

  unselectFile(): void {
    this.file = null;
  }
}
