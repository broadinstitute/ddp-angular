import {Component, Inject, OnInit} from '@angular/core';
import { HeaderConfigurationService } from '../../../../../toolkit/src/lib/services/headerConfiguration.service';
import { ToolkitConfigurationService } from '../../../../../toolkit/src/lib/services/toolkitConfiguration.service';

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
