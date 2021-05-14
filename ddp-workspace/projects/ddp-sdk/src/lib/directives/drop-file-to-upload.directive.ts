import {
    EventEmitter,
    Directive,
    HostBinding,
    HostListener,
    Output
} from '@angular/core';

@Directive({
  selector: '[dropFileToUpload]'
})
export class DropFileToUploadDirective {
    @Output() filesDropped = new EventEmitter<any>();
    @HostBinding('class.file-over') fileOver: boolean;

    @HostListener('dragover', ['$event'])
    onDragOver(event): void {
        this.prevent(event);
        this.fileOver = true;
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event): void {
        this.prevent(event);
        this.fileOver = false;
    }

    @HostListener('drop', ['$event'])
    onDrop(event): void {
        this.prevent(event);
        this.fileOver = false;

        const files = event.dataTransfer.files;
        if (files && files.length) {
            this.filesDropped.emit(files);
        }
    }

    private prevent(event): void {
        event.preventDefault();
        event.stopPropagation();
    }
}
