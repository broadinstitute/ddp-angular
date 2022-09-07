import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
})
export class QrCodeComponent {
  @Input() qrCodeValue: string;
}
