import { Component, Inject, OnInit } from '@angular/core';
import { AppRoutes } from '../../app-routes';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public appRoutes = AppRoutes;
  public cmiUrl: string;
  public infoEmail: string;
  public infoEmailHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.cmiUrl = this.config.countMeInUrl;
    this.infoEmail = this.config.infoEmail;
    this.infoEmailHref = `mailto:${this.infoEmail}`;
  }
}
