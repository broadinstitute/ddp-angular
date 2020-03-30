import { Component, OnInit, Inject } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-for-your-physician',
  templateUrl: './for-your-physician.component.html',
  styleUrls: ['./for-your-physician.component.scss']
})
export class ForYourPhysicianComponent implements OnInit {
  public phone: string;
  public phoneHref: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
  }
}
