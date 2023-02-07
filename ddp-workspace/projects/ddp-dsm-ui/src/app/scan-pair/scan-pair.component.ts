import {Component, OnInit, ViewChild, Output, EventEmitter, Input, TemplateRef, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-scan-pair',
  templateUrl: './scan-pair.component.html',
  styleUrls: ['./scan-pair.component.css']
})
export class ScanPairComponent implements OnInit, OnDestroy {
  public lessThanOrMoreThanSix = false;

  private subscription: Subscription;

  @ViewChild('leftInput', {static: true}) leftInput;
  @ViewChild('rightInput') rightInput;
  @ViewChild('RGPDialog', {static: true, read: TemplateRef}) RGPDialog;

  @Input() positionScanPair: number;
  @Input() countScanPair: number;
  @Input() isLeftValueDuplicate = false;
  @Input() isRightValueDuplicate = false;
  @Input() hadErrorSending = false;
  @Input() leftInputPlaceholder = 'Kit Label';
  @Input() rightInputPlaceholder = 'DSM Label';
  @Input() errorMessage: string;
  @Input() initialScan = false;
  @Input() RGPFinalScan = false;

  @Output() pairScanned = new EventEmitter();
  @Output() removeScanPair = new EventEmitter();
  @Output() leftLabelAdded = new EventEmitter();

  public continueRGP = false;

  ngOnInit(): void {
    this.leftInput.nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  constructor(public dialog?: MatDialog) {
  }

  moveFocus(leftValue: string): void {
      this.rightInput.nativeElement.focus();
      this.leftLabelAdded.next([leftValue, this.positionScanPair]);
  }

  nextPair(leftValue: string, rightValue: string): void {
    if(this.initialScan) {
      this.lessThanOrMoreThanSix = rightValue?.length !== 6;
    }
    if(this.RGPFinalScan && !rightValue.slice(0, 4).includes('RNA')) {
       const openDialog: MatDialogRef<any> = this.dialog.open(this.RGPDialog, {
         width: '250px',
       });
     this.subscription = openDialog.afterClosed()
       .subscribe(() =>
         this.continueRGP && this.pairScanned.next([leftValue, rightValue, this.positionScanPair])
       )
    } else {
      this.pairScanned.next([leftValue, rightValue, this.positionScanPair]);
    }
  }

  removeMe(): void {
    this.removeScanPair.next(this.positionScanPair);
  }
}
