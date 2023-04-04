import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';
import { AbstractionGroup } from '../abstraction-group/abstraction-group.model';

@Component({
  selector: 'app-abstraction-settings',
  templateUrl: './abstraction-settings.component.html',
  styleUrls: ['./abstraction-settings.component.css']
})
export class AbstractionSettingsComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;

  loading = false;
  saving = false;

  realmsAllowed: Array<string> = [];
  realm: string;

  abstractionFormControls: Array<AbstractionGroup>;
  allowedToSeeInformation = false;
  isViewHelp = true;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private dsmService: DSMService,
    private auth: Auth,
    private role: RoleService,
    private compService: ComponentService,
    private route: ActivatedRoute
  ) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
    this.route.queryParams.subscribe({
      next: params => {
        this.realm = params[DSMService.REALM] || null;
        if (this.realm != null) {
          //        this.compService.realmMenu = this.realm;
          this.checkRight();
        }
      }
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      this.checkRight();
    } else {
      this.additionalMessage = 'Please select a study';
    }
    window.scrollTo(0, 0);
  }

  private checkRight(): void {
    this.allowedToSeeInformation = false;
    this.additionalMessage = null;
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.MEDICALRECORD).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (this.realm === val) {
            this.allowedToSeeInformation = true;
            this.loadAbstractionFormControls();
          }
        });
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    });
  }

  loadAbstractionFormControls(): void {
    this.loading = true;
    let jsonData: any[];
    this.dsmService.getMedicalRecordAbstractionFormControls(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM)).subscribe({
      next: data => {
        this.abstractionFormControls = [];
        jsonData = data;
        jsonData.forEach((val) => {
          const medicalRecordAbstractionGroup = AbstractionGroup.parse(val);
          this.abstractionFormControls.push(medicalRecordAbstractionGroup);
        });
        this.loading = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.sessionLogout();
          this.loading = false;
        }
        this.errorMessage = 'Error - Loading medical record abstraction form controls\n ' + err;
      }
    });
  }

  saveSettings(): void {
    if (this.realm != null) {
      let foundError = false;
      this.loading = true;
      const cleanedSettings: Array<AbstractionGroup> = AbstractionGroup.removeUnchangedSetting(this.abstractionFormControls);
      for (const setting of cleanedSettings) {
        if (setting.notUniqueError) {
          foundError = true;
        }
      }
      if (foundError) {
        this.additionalMessage = 'Please change duplicates first!';
        this.loading = false;
      } else {
        this.dsmService.saveMedicalRecordAbstractionFormControls(
            sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
            JSON.stringify(cleanedSettings, (key, value) => {
              if (value !== null) {
                return value;
              }
            }))
          .subscribe({
            next: () => {
              this.loadAbstractionFormControls();
            },
            error: err => {
              if (err._body === Auth.AUTHENTICATION_ERROR) {
                this.auth.sessionLogout();
                this.loading = false;
              }
              this.errorMessage = 'Error - Loading medical record abstraction form controls\n ' + err;
            }
          });
      }
      window.scrollTo(0, 0);
    }
  }

  doNothing(): boolean { // needed for the menu, otherwise page will refresh!
    return false;
  }
}
