import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public appRoutes = AppRoutes;

  constructor(
    private renderer: Renderer2,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
  }

  scrollTo(selector: string): void {
    const anchor = this.renderer.selectRootElement(selector);
    anchor.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
