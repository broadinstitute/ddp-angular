import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-stay-informed',
  templateUrl: './stay-informed.component.html',
  styleUrls: ['./stay-informed.component.scss']
})
export class StayInformedComponent implements OnInit {
  public email: string;
  public emailHref: string;

  constructor(
    private router: Router,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.email = this.toolkitConfiguration.infoEmail;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
  }

  public returnHome(): void {
    this.router.navigateByUrl('');
  }
}
