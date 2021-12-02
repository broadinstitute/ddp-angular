import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scan-value',
  templateUrl: './scan-value.component.html',
  styleUrls: ['./scan-value.component.css']
})
export class ScanValueComponent implements OnInit {
  @ViewChild('scanValue') scanValue;

  @Input() positionScanValue: number;
  @Input() countScanValue: number;
  @Input() isScanValueDuplicate = false;
  @Input() hadErrorSending = false;
  @Input() scanValuePlaceholder = 'SM-ID';
  @Input() errorMessage: string;

  @Output() valueScanned = new EventEmitter();
  @Output() removeScanValue = new EventEmitter();

  ngOnInit(): void {
    this.scanValue.nativeElement.focus();
  }

  nextValue(value: string): void {
    this.valueScanned.next([value, this.positionScanValue]);
  }

  removeMe(): void {
    this.removeScanValue.next(this.positionScanValue);
  }
}
