import { Component, Inject, OnInit } from '@angular/core';
import { HeaderConfigurationService } from '../../../../../toolkit/src/lib/services/headerConfiguration.service';
import { ToolkitConfigurationService } from '../../../../../toolkit/src/lib/services/toolkitConfiguration.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public infoEmail: string;
  public phone: string;
  public infoEmailHref: string;
  public phoneHref: string;

  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.infoEmail = this.toolkitConfiguration.infoEmail;
    this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
    this.phone = this.toolkitConfiguration.phone;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.headerConfig.setupDefaultHeader();
  }
}
