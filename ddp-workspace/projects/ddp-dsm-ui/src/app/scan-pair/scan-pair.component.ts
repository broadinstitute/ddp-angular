import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-scan-pair',
  templateUrl: './scan-pair.component.html',
})
export class ScanPairComponent implements OnInit {
  public lessThanOrMoreThanSix = false;

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
  @Input() initialScan = false;

  @Output() pairScanned = new EventEmitter();
  @Output() removeScanPair = new EventEmitter();
  @Output() leftLabelAdded = new EventEmitter();

  ngOnInit(): void {
    this.leftInput.nativeElement.focus();
  }

  moveFocus(leftValue: string): void {
      this.rightInput.nativeElement.focus();
      this.leftLabelAdded.next([leftValue, this.positionScanPair]);
  }

  nextPair(leftValue: string, rightValue: string): void {
    if(this.initialScan) {
      this.lessThanOrMoreThanSix = rightValue?.length !== 6;
    }
    this.pairScanned.next([leftValue, rightValue, this.positionScanPair]);
  }

  removeMe(): void {
    this.removeScanPair.next(this.positionScanPair);
  }
}
