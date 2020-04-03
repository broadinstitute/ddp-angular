import { Component, OnInit, Inject, Input } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() public errorText: string;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
  }
}
