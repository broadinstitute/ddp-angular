import {Component, OnInit, ViewChild, Output, EventEmitter, Input, TemplateRef, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-scan-pair',
  templateUrl: './scan-pair.component.html',
  styleUrls: ['./scan-pair.component.css']
})
export class ScanPairComponent implements OnInit {
  public lessThanOrMoreThanSix = false;

  @ViewChild('leftInput', {static: true}) leftInput;
  @ViewChild('rightInput') rightInput;
  @ViewChild('RGPInput') RGPInput;

  @Input() positionScanPair: number;
  @Input() countScanPair: number;
  @Input() isLeftValueDuplicate = false;
  @Input() isRightValueDuplicate = false;
  @Input() hadErrorSending = false;
  @Input() leftInputPlaceholder = 'Kit Label';
  @Input() rightInputPlaceholder = 'DSM Label';
  @Input() errorMessage: string;
  @Input() initialScan: boolean = false;
  @Input() RGPFinalScan: boolean = false;
  RGPPlaceholder: string = 'RNA';

  @Output() pairScanned = new EventEmitter();
  @Output() removeScanPair = new EventEmitter();
  @Output() leftLabelAdded = new EventEmitter();

  ngOnInit(): void {
    this.leftInput.nativeElement.focus();
  }

  constructor(public dialog?: MatDialog) {}

  moveFocus(leftValue: string): void {
      this.rightInput.nativeElement.focus();
      this.leftLabelAdded.next([leftValue, this.positionScanPair]);
  }

  nextPair(leftValue: string, rightValue: string, RGPInputValue?: string): void {
    if(this.initialScan) {
      this.lessThanOrMoreThanSix = rightValue?.length !== 6;
    }
    if(this.RGPFinalScan && !RGPInputValue) {
      this.RGPInput.nativeElement.focus();
    }

    if(this.RGPFinalScan && RGPInputValue) {
      this.pairScanned.next([leftValue, rightValue, this.positionScanPair]);
    }

    if(!this.RGPFinalScan) {
      this.pairScanned.next([leftValue, rightValue, this.positionScanPair]);
    }
  }

  removeMe(): void {
    this.removeScanPair.next(this.positionScanPair);
  }
}
