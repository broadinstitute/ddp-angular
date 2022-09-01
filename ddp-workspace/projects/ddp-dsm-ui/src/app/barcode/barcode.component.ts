import {AfterViewChecked, Component, Input} from "@angular/core";

declare var JsBarcode: any;

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
})
export class BarcodeComponent implements AfterViewChecked {

  @Input() barcodeValue: string;

  ngAfterViewChecked() {
    this.initByIdJsBarcode();
  }

  private initByIdJsBarcode(): void {
    JsBarcode('#' + this.barcodeValue).init();
  }
}
