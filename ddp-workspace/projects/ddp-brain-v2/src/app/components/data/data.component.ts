import { Component, OnInit, Inject } from '@angular/core';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  infoEmail: string;

  constructor(
    private communicationService: CommunicationService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.infoEmail = this.config.infoEmail;
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
