import { Component } from '@angular/core';

declare var DDP_ENV: any;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  production: boolean = DDP_ENV.production;
  environment: string = DDP_ENV.environment;
}
