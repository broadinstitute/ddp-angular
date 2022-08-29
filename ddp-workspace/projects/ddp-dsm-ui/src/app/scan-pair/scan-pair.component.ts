import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-scan-pair',
  templateUrl: './scan-pair.component.html',
})
export class ScanPairComponent implements OnInit {
  @ViewChild('leftInput', {static: true}) leftInput;
  @ViewChild('rightInput') rightInput;

  @Input() positionScanPair: number;
  @Input() countScanPair: number;
  @Input() isLeftValueDuplicate = false;
  @Input() isRightValueDuplicate = false;
  @Input() hadErrorSending = false;
  @Input() leftInputPlaceholder = 'Kit Label';
  @Input() rightInputPlaceholder = 'DSM Label';
  @Input() errorMessage: string;

  @Output() pairScanned = new EventEmitter();
  @Output() removeScanPair = new EventEmitter();
  @Output() leftLabelAdded = new EventEmitter();

  lengthError: string;

  ngOnInit(): void {
    this.leftInput.nativeElement.focus();
  }

  moveFocus(leftValue: string): void {
    if(leftValue.length < 14) {
      this.lengthError = "Error: Barcode contains less than 14 digits. You can manually enter any missing digits above.";
    } else {
      this.lengthError = null;
      this.rightInput.nativeElement.focus();
      this.leftLabelAdded.next([leftValue, this.positionScanPair]);
    }

  }

  nextPair(leftValue: string, rightValue: string): void {
    this.pairScanned.next([leftValue, rightValue, this.positionScanPair]);
  }

  removeMe(): void {
    this.removeScanPair.next(this.positionScanPair);
  }
}
