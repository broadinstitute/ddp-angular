import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';

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
    private renderer: Renderer2,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
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
