import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CommunicationService, ToolkitConfigurationService } from 'toolkit';
import { ModalImageComponent } from '../modal-image/modal-image.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  infoEmail: string;
  @ViewChild('modalImage', { static: false }) public modalImage: ModalImageComponent;

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
