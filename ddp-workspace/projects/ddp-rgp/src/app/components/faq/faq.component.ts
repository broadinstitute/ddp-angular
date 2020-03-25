import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  public isGeneralCollapsed: boolean = true;
  public isBeforeCollapsed: boolean = true;
  public isProcessCollapsed: boolean = true;
  public isCollectionCollapsed: boolean = true;
  public isReturnCollapsed: boolean = true;
  public isDataCollapsed: boolean = true;
  public isSpreadCollapsed: boolean = true;

  public collapsed(event: any): void { }

  public expanded(event: any): void { }
}
