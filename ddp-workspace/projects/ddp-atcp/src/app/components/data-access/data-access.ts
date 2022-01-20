import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { iif, of } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { CompositeDisposable } from 'ddp-sdk';

import { ToolkitConfigurationService } from 'toolkit';

import { DataAccessParameters } from '../../models/dataAccessParameters';
import { DataAccessService } from '../../services/dataAccess.service';
import { PopupMessage } from '../../toolkit/models/popupMessage';
import { AtcpCommunicationService } from '../../toolkit/services/communication.service';
import * as Routes from '../../router-resources';

@Component({
  selector: 'app-data-access',
  templateUrl: './data-access.html',
  styleUrls: ['./data-access.scss'],
})
export class DataAccessComponent implements OnInit, OnDestroy {
  public busy = false;
  public activeTab = 0;
  public countTabs = 7;
  public fileSizeExceedsLimit: boolean;
  public studyGuid: string;
  public model: DataAccessParameters = new DataAccessParameters();
  public researcherBiosketch: File;
  public recaptchaToken: string;

  private readonly maxAttachmentSize = 2 * 1024 * 1024;
  private anchor: CompositeDisposable = new CompositeDisposable();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private recaptchaService: ReCaptchaV3Service,
    private dataAccessService: DataAccessService,
    private communicationService: AtcpCommunicationService,
    @Inject('toolkit.toolkitConfig')
    private toolkitConfiguration: ToolkitConfigurationService,
  ) {}

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

    this.recaptchaService
      .execute('file_upload')
      .pipe(take(1))
      .subscribe(token => {
        this.recaptchaToken = token;
        this.researcherBiosketch = selectedFile;
      });
  }

  public displayDontHaveErrors(tab: number): boolean {
    if (tab === 1) {
      return !!(this.model.researcher_name && this.model.researcher_email);
    } else if (tab === 2) {
      return !!(
        this.model.org_name &&
        this.model.org_address_1 &&
        this.model.org_city &&
        this.model.org_country &&
        this.model.org_zip
      );
    } else if (tab === 3) {
      return !!(this.model.project_description && this.model.research_use);
    } else if (tab === 6) {
      return !!this.model.researcher_signature;
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
    return (
      data.getFullYear() +
      '-' +
      (month > 9 ? month : '0' + month) +
      '-' +
      (day > 9 ? day : '0' + day)
    );
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

    this.busy = true;

    const sendDar$ = this.dataAccessService
      .send(this.model, this.researcherBiosketch, this.recaptchaToken)
      .pipe(take(1));

    const getTokenFirst$ = this.recaptchaService.execute('dar_submit').pipe(
      switchMap(token =>
        this.dataAccessService.send(
          this.model,
          this.researcherBiosketch,
          token,
        ),
      ),
      take(1),
    );

    of(this.recaptchaToken)
      .pipe(switchMap(token => iif(() => !!token, sendDar$, getTokenFirst$)))
      .subscribe({
        next: () => this.showResponse(),
        error: () => this.showError(),
      });
  }

  private showResponse(): void {
    this.busy = false;
    this.recaptchaToken = null;

    this.communicationService.showPopupMessage(
      new PopupMessage(
        this.translateService.instant('DataAccess.Messages.Success'),
        false,
      ),
    );

    of('')
      .pipe(take(1))
      .pipe(delay(3000))
      .subscribe(() => {
        this.communicationService.closePopupMessage();

        this.router.navigateByUrl(Routes.Welcome);
      });
  }

  private showError(): void {
    this.busy = false;
    this.recaptchaToken = null;

    this.communicationService.showPopupMessage(
      new PopupMessage(
        this.translateService.instant('DataAccess.Messages.Error'),
        true,
      ),
    );

    of('')
      .pipe(take(1))
      .pipe(delay(3000))
      .subscribe(() => {
        this.communicationService.closePopupMessage();
      });
  }
}
