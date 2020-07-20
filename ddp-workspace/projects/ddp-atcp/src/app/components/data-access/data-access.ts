import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';
import {DataAccessService} from "../../services/dataAccess.service";
import { DataAccessParameters } from '../../models/dataAccessParameters';
import {CommunicationService, ToolkitConfigurationService} from "toolkit";
import {DataAccessServiceAgent} from "../../services/serviceAgents/dataAccessServiceAgent.service";
import {DataAccessRequestSuccessResult} from "../../models/dataAccessRequestSuccessResult";
import {DataAccessRequestError} from "../../models/dataAccessRequestError";
import { of } from "rxjs";
import {delay} from "rxjs/operators";
import {ServerMessage} from "../../../../../toolkit/src/lib/models/serverMessage";

@Component({
  selector: 'app-data-access',
  templateUrl: './data-access.html',
  styleUrls: ['./data-access.scss'],
  providers: [DataAccessService, DataAccessServiceAgent]
})
export class DataAccessComponent implements OnInit, OnDestroy {

  public activeTab = 0;
  public countTabs = 7;
  private readonly maxAttachmentSize = 2 * 1024 * 1024;
  private anchor: CompositeDisposable = new CompositeDisposable();
  public fileSizeExceedsLimit: boolean;
  public studyGuid: string;

  public model: DataAccessParameters = new DataAccessParameters();
  public researcherBiosketch: File;
  public displayDontHaveErrors(tab: number): boolean {
    if (tab === 1) {
      return !!(this.model.researcher_name && this.model.researcher_email);
    } else if (tab === 2) {
      return !!(this.model.org_name && this.model.org_address_1 && this.model.org_city && this.model.org_country && this.model.org_zip);
    } else if (tab === 3) {
      return !!(this.model.project_description && this.model.research_use);
    } else if (tab === 6) {
      return !!(this.model.researcher_signature);
    }
    return true;
  }

  public setActiveTab(index: number, event?): void {
    if (event) {
      event.preventDefault();
    }
    this.activeTab = index;
  }

  public getToday(): string {
    const data = new Date();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    return data.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
  }

  public submit(form): void {
    if (form.invalid) {
      form.submitted = true;
      for (let i = 0; i < this.countTabs; i++) {
        if (!this.displayDontHaveErrors(i)) {
          this.activeTab = i;
          return;
        }
      }
    }

    this.dataAccessService.createNewDataAccessRequest(this.model, this.researcherBiosketch, this.studyGuid).subscribe(
      {
        next: value => this.showResponse(value) ,
        error: error => this.showError(error)
      }
    );
  }

  private showResponse(dataAccessRequestSuccessResult: DataAccessRequestSuccessResult): void {
    this.communicationService.showMessageFromServer(new ServerMessage(dataAccessRequestSuccessResult.message, false));
    of('').pipe(delay(3000)).subscribe(() => {
      this.communicationService.closeMessageFromServer();
    });
  }

  private showError(error: DataAccessRequestError): void {
    this.communicationService.showMessageFromServer(new ServerMessage(error.text, true));
    of('').pipe(delay(3000)).subscribe(() => {
      this.communicationService.closeMessageFromServer();
    });
  }

  constructor(private ngxTranslate: NGXTranslateService,
              private dataAccessService: DataAccessService,
              private communicationService: CommunicationService,
              @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
  }

  public ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.model.signature_date = this.getToday();
    this.model.request_date = this.getToday();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public onAttachmentChange(selectedFile: any): void {
    if (this.maxAttachmentSize && selectedFile.size >= this.maxAttachmentSize) {
      this.fileSizeExceedsLimit = true;
      return;
    } else {
      this.fileSizeExceedsLimit = false;
    }
    this.researcherBiosketch = selectedFile;
  }
}
