import {Component, Input, AfterViewChecked} from '@angular/core';
import { Address } from '../address/address.model';
import { LabelSetting } from '../label-settings/label-settings.model';

declare var JsBarcode: any;

@Component({
  selector: 'app-error-label',
  templateUrl: './error-label.component.html',
  styleUrls: ['./error-label.component.css']
})
export class ErrorLabelComponent implements AfterViewChecked {
  @Input() address: Address;
  @Input() shippingId: string;
  @Input() labelSetting: LabelSetting;


  ngAfterViewChecked(): void {
    this.initByIdJsBarcode();
  }

  private initByIdJsBarcode(): void {
    JsBarcode('#' + this.shippingId).init();
  }

  public getLabelHeight(): string {
    if (this.labelSetting != null) {
      // making it a little smaller than it could be
      return (this.labelSetting.labelHeight - 0.2) + 'in';
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
      // making it a little smaller than it could be
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
