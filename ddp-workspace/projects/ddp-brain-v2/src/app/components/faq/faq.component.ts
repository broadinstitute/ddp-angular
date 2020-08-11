import { Component, OnInit, Inject } from '@angular/core';
import { HeaderConfigurationService, ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public phone: string;
  public infoEmail: string;
  public cmiUrl: string;

  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.headerConfig.setupDefaultHeader();
    this.infoEmail = this.config.infoEmail;
    this.phone = this.config.phone;
    this.cmiUrl = this.config.countMeInUrl;
  }
}
