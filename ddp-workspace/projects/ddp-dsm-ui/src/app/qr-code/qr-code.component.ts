import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';

declare var JsBarcode: any;

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
})
export class QrCodeComponent {
  @Input() barcodeValue: string;
}
