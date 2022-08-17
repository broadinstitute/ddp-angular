import {Component, Input, AfterViewChecked, OnChanges, SimpleChanges} from '@angular/core';
import { LabelSetting } from '../label-settings/label-settings.model';
import {KitRequest} from "../shipping/shipping.model";

declare var JsBarcode: any;

@Component({
  selector: 'app-kit-label',
  templateUrl: './kit-label.component.html',
  styleUrls: ['./kit-label.component.css']
})

export class KitLabelComponent implements AfterViewChecked, OnChanges {
  @Input() urlTo: string;
  @Input() shippingId: string;
  @Input() urlReturn: string;
  @Input() labelSetting: LabelSetting;

  @Input() patientNameDOB: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, "data here")
  }

  ngAfterViewChecked(): void {
    console.log(this.patientNameDOB);
    // const patientInfo = this.patientNameDOB.firstLastName + "_" + this.patientNameDOB.dateOfBirth;
    this.initByIdJsBarcode(this.shippingId);
  }

  private initByIdJsBarcode(id: string): void {
    JsBarcode('#' + id).init();
  }

  get buildBarCodeValue(): string {
    return this.patientNameDOB.split("_").join(" ");
  }

  public getLabelHeight(): string {
    if (this.labelSetting != null) {
      // making it a little smaller than it could be
      return (this.labelSetting.labelHeight - 0.2) + 'in';
    }
  }

  public getHeightWithSpaceForBarcode(): string {
    if (this.labelSetting != null) {
      // making it a little smaller than it could be
      if (this.getLabelHeight() !== this.getLabelWidth()) {
        if (this.labelSetting.labelHeight - this.labelSetting.labelWidth <= 1) {
          return (this.labelSetting.labelHeight - 0.5) + 'in';
        }
      } else {
        return this.getLabelHeight();
      }
    }
  }

  public getFullLabelHeight(): string {
    if (this.labelSetting != null) {
      // making it a little smaller than it could be
      return this.labelSetting.labelHeight + 'in';
    }
  }

  public getLabelWidth(): string {
    if (this.labelSetting != null) {
      // making it a little smaller than it could be
      return (this.labelSetting.labelWidth - 0.2) + 'in';
    }
  }

  public getFullLabelWidth(): string {
    if (this.labelSetting != null) {
      return this.labelSetting.labelWidth + 'in';
    }
  }

  public getLeftMargin(): string {
    if (this.labelSetting != null) {
      return this.labelSetting.leftMargin + 'in';
    }
  }

  public getMarginBetweenLeftRight(): string {
    if (this.labelSetting != null && this.labelSetting.labelOnPage > 1) {
      const letter = 8.5;
      const space = letter - this.labelSetting.leftMargin
        - (this.labelSetting.labelWidth * (this.labelSetting.labelOnPage / 2)) - this.labelSetting.rightMargin;
      return space + 'in';
    }
  }
}
