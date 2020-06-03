import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-data-access',
  templateUrl: './data-access.html',
  styleUrls: ['./data-access.scss']
})
export class DataAccessComponent implements OnInit, OnDestroy {
  public name: string;
  public email: string;

  public orgname: string;
  public address1: string;
  public city: string;
  public country: string;
  public zip: string;

  public description: string;
  public use: string;

  public sign: string;
  public activeTab = 0;
  public countTabs = 7;
  public todayString: string = this.getToday();
  public AssuranceList: string[] = [];
  attachment: File = null;
  private readonly maxAttachmentSize = 2 * 1024 * 1024;
  private anchor: CompositeDisposable = new CompositeDisposable();
  public fileSizeExceedsLimit: boolean;

  public displayDontHaveErrors(tab: number): boolean {
    if (tab === 1) {
      return !!(this.name && this.email);
    } else if (tab === 2) {
      return !!(this.orgname && this.address1 && this.city && this.country && this.zip);
    } else if (tab === 3) {
      return !!(this.description && this.use);
    } else if (tab === 6) {
      return !!(this.sign);
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
    const mouth = data.getMonth() + 1;
    const day = data.getDay();
    return data.getFullYear() + '-' + (mouth > 9 ? mouth : '0' + mouth) + '-' + (day > 9 ? day : '0' + day);
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
  }

  constructor(private ngxTranslate: NGXTranslateService) {
  }

  public ngOnInit(): void {
    const translate$ = this.ngxTranslate.getTranslation('DataAccess.Assurances.AssuranceList')
      .subscribe((list: string[]) => this.AssuranceList = list);
    this.anchor.addNew(translate$);
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
    this.attachment = selectedFile;
  }
}
