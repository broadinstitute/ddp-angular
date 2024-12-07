import { Component, OnInit, Inject } from '@angular/core';
import { ToolkitConfigurationService, HeaderConfigurationService } from 'toolkit';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  public countMeInUrl: string;

  constructor(
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
    this.headerConfig.setupDefaultHeader();
  }
}
