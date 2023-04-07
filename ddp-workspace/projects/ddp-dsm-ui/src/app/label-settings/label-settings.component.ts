import { Component, OnInit } from '@angular/core';
import { LabelSetting } from './label-settings.model';
import { Auth } from '../services/auth.service';
import { DSMService } from '../services/dsm.service';

@Component({
  selector: 'app-label-settings',
  templateUrl: './label-settings.component.html',
  styleUrls: ['./label-settings.component.css']
})
export class LabelSettingsComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;

  loading = false;

  pageSettings: LabelSetting[];

  constructor(private auth: Auth, private dsmService: DSMService) { }

  ngOnInit(): void {
    this.getListOfLabelSettings();
  }

  getListOfLabelSettings(): void {
    this.pageSettings = [];
    this.loading = true;
    let jsonData: any[];
    this.dsmService.getLabelSettings().subscribe({
      next: data => {
        jsonData = data;
        // console.info(`received: ${JSON.stringify(data, null, 2)}`);
        jsonData.forEach((val) => {
          const event = LabelSetting.parse(val);
          this.pageSettings.push(event);
        });
        this.addPageSetting();
        this.loading = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
        this.loading = false;
        this.errorMessage = 'Error - Loading Label Settings\nPlease contact your DSM developer';
      }
    });
  }

  check(index: number): void {
    if (this.pageSettings[index].defaultPage) {
      for (let i = 0; i < this.pageSettings.length; i++) {
        if (i !== index) {
          if (this.pageSettings[i].defaultPage) {
            this.pageSettings[i].defaultPage = false;
            this.pageSettings[i].changed = true;
          }
        }
      }
    }
    this.onChange(index);
  }

  onChange(index: number): void {
    this.pageSettings[index].changed = true;
    if (index === this.pageSettings.length - 1) {
      this.addPageSetting();
    }
  }

  addPageSetting(): void {
    const labelSetting: LabelSetting = new LabelSetting(null, null, null, false,
      0, 0, 0, 0, 0, 0, 0);
    labelSetting.addedNew = true;
    this.pageSettings.push(labelSetting);
  }

  deletePageSetting(index: number): void {
    this.pageSettings[index].deleted = true;
    this.onChange(index);
    this.saveSettings();
  }

  saveSettings(): void {
    let foundError = false;
    const cleanedSettings: Array<LabelSetting> = LabelSetting.removeUnchangedLabelSetting(this.pageSettings);
    for (const setting of cleanedSettings) {
      if (setting.notUniqueError) {
        foundError = true;
      }
    }
    if (foundError) {
      this.additionalMessage = 'Please fix errors first!';
    } else {
      this.loading = true;
      this.dsmService.saveLabelSettings(JSON.stringify(cleanedSettings)).subscribe({
        next: () => {
          this.getListOfLabelSettings();
          this.loading = false;
          this.additionalMessage = 'Data saved';
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
          this.loading = false;
          this.additionalMessage = 'Error - Saving label settings\nPlease contact your DSM developer';
        }
      });
    }
    window.scrollTo(0, 0);
  }

  checkName(index: number): void {
    this.pageSettings[index].notUniqueError = false;
    for (let i = 0; i < this.pageSettings.length; i++) {
      if (i !== index) {
        if (this.pageSettings[i].name === this.pageSettings[index].name) {
          this.pageSettings[index].notUniqueError = true;
        }
      }
    }
    return null;
  }
}
