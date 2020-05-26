import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { ScrollerService } from '../../services/scroller.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public appRoutes = AppRoutes;

  constructor(
    private scrollerService: ScrollerService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
  }

  public scrollToAnchor(anchor: string): void {
    this.scrollerService.scrollToAnchor(anchor);
  }
}
