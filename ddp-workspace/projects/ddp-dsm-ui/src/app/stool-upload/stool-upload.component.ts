import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { Utils } from '../utils/utils';
import { UploadParticipant, UploadResponse } from './stool-upload.model';
import { KitType } from '../utils/kit-type.model';
import { ModalComponent } from '../modal/modal.component';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';
import { FieldFilepickerComponent } from '../field-filepicker/field-filepicker.component';
import { Result } from '../utils/result.model';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-stool-upload',
  templateUrl: './stool-upload.component.html',
  styleUrls: ['./stool-upload.component.css']
})

export class StoolUploadComponent implements OnInit {
  @ViewChild(ModalComponent)
  public modal: ModalComponent;

  @ViewChild(FieldFilepickerComponent)
  public filepicker: FieldFilepickerComponent;

  errorMessage: string;
  additionalMessage: string;

  loading = false;
  uploadPossible = false;

  kitTypes: Array<KitType> = [];
  uploadReasons: Array<string> = [];
  carriers: Array<string> = [];
  kitType: KitType;

  file: File = null;

  failedParticipants: Array<UploadParticipant> = [];
  duplicateParticipants: Array<UploadParticipant> = [];
  specialKits: Array<UploadParticipant> = [];

  realmNameStoredForFile: string;
  allowedToSeeInformation = false;
  specialMessage: string;
  skipAddressValidation = false;

  constructor( private dsmService: DSMService, private auth: Auth, private compService: ComponentService, private route: ActivatedRoute,
               private role: RoleService ) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.realmNameStoredForFile = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    this.route.queryParams.subscribe(params => {
      const realm = params[ DSMService.REALM ] || null;
      if (realm != null && realm !== '') {
        //        this.compService.realmMenu = realm;
        this.checkRight();
      }
    });
  }

  private checkRight(): void {
    this.allowedToSeeInformation = false;
    this.additionalMessage = null;
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.SHIPPING).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
            this.allowedToSeeInformation = true;
            this.getPossibleKitType();
          }
        });
        if (!this.allowedToSeeInformation) {
          this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.checkRight();
    } else {
      this.additionalMessage = 'Please select a study';
    }
    window.scrollTo(0, 0);
  }

  getPossibleKitType(): void {
    if (this.isSelectedRealm()) {
      this.loading = true;
      let jsonData: any[];
      this.dsmService.getKitTypes(localStorage.getItem(ComponentService.MENU_SELECTED_REALM)).subscribe({
        next: data => {
          this.kitTypes = [];
          jsonData = data;
          jsonData.forEach((val) => {
            const kitType = KitType.parse(val);
            if(kitType.kitId==15){
              this.kitTypes.push(kitType);
            }
          });
          if (this.kitTypes.length === 1) {
            this.kitType = this.kitTypes[ 0 ];
          } else {
            this.errorMessage = "Study does not have stool kit";
          }
          // console.info(`${this.kitTypes.length} kit types received: ${JSON.stringify(data, null, 2)}`);
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loading = false;
          this.errorMessage = 'Error - Loading kit types\n' + err;
        }
      });
    }
  }

  upload(): void {
    this.errorMessage = null;
    this.additionalMessage = null;
    this.failedParticipants = [];
    this.loading = true;
    this.dsmService.uploadStoolTxtFile(
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.kitType.name,
      this.file, this.skipAddressValidation
    )
      .subscribe({
        next: data => {
          this.loading = false;
          if (typeof data === 'string') {
            this.errorMessage = 'Error - Uploading txt.\n' + data;
          } else {

            const result = Result.parse(data);
            if (result.code === 500) {
              this.additionalMessage = result.body;
            } else {
              const response: UploadResponse = UploadResponse.parse(data);
              response.invalidKitAddressList.forEach((val) => {
                this.failedParticipants.push(UploadParticipant.parse(val));
              });
              if (this.failedParticipants.length > 0) {
                // eslint-disable-next-line max-len
                this.errorMessage = 'Participants uploaded.\nCouldn\'t create kit requests for ' + this.failedParticipants.length + ' participant(s)';
              }

              response.duplicateKitList.forEach((val) => {
                this.duplicateParticipants.push(UploadParticipant.parse(val));
              });
              response.specialKitList.forEach((val) => {
                this.specialKits.push(UploadParticipant.parse(val));
              });
              this.specialMessage = response.specialMessage;

              if (this.duplicateParticipants.length > 0 || this.specialKits.length > 0) {
                this.modal.show();
              }
              if (this.failedParticipants.length === 0 && this.duplicateParticipants.length === 0) {
                this.additionalMessage = 'All participants were uploaded.';
                this.file = null;
                this.filepicker.unselectFile();
                this.realmNameStoredForFile = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
              }
            }
          }
        },
        error: err => {
          this.loading = false;
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.errorMessage = 'Error - Uploading txt\n' + err;
        }
      });
  }

  downloadFailed(): void {
    if (this.failedParticipants != null && this.failedParticipants.length > 0 && this.realmNameStoredForFile != null &&
      this.kitType != null && this.kitType.name != null) {
      const fields = [ 'mfBarcode', 'participantId', 'receiveDate'];
      const date = new Date();
      Utils.createCSV(
        fields,
        this.failedParticipants,
        'Upload ' + this.realmNameStoredForFile + ' ' + this.kitType.name + ' Failed '
        + Utils.getDateFormatted(date, Utils.DATE_STRING_CVS) + Statics.CSV_FILE_EXTENSION
      );
      this.realmNameStoredForFile = null;
    } else {
      this.errorMessage = 'Error - Couldn\'t save failed participant list';
    }
  }

  uploadDuplicate(): void {
    this.additionalMessage = null;
    this.errorMessage = null;
    this.loading = true;
    const array: UploadParticipant[] = [];
    for (let i = this.duplicateParticipants.length - 1; i >= 0; i--) {
      if (this.duplicateParticipants[ i ].selected) {
        array.push(this.duplicateParticipants[ i ]);
      }
    }
    for (let i = this.specialKits.length - 1; i >= 0; i--) {
      if (this.specialKits[ i ].selected) {
        array.push(this.specialKits[ i ]);
      }
    }
    const jsonParticipants = JSON.stringify(array);
    this.dsmService.uploadStoolDuplicateParticipant(
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.kitType.name,
      jsonParticipants, this.skipAddressValidation
    )
      .subscribe({
        next: data => {
          this.loading = false;
          if (typeof data === 'string') {
            this.errorMessage = 'Error - Uploading duplicate.\n' + data;
          } else {
            this.additionalMessage = 'All participants were uploaded.';
          }
        },
        error: err => {
          this.loading = false;
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.errorMessage = 'Error - Uploading txt\n' + err;
        }
      });
    this.emptyUpload();
  }

  forgetDuplicate(): void {
    this.additionalMessage = 'No duplicate kits uploaded';
    this.emptyUpload();
  }

  emptyUpload(): void {
    this.modal.hide();
    this.duplicateParticipants = [];
    this.specialKits = [];
    this.file = null;
    this.filepicker.unselectFile();
    this.realmNameStoredForFile = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }

  fileSelected(file: File): void {
    this.file = file;
  }

  getCompService(): ComponentService {
    return this.compService;
  }

  allOptionsSelected(): boolean {
    this.uploadPossible = this.kitType != null && (this.uploadReasons.length === 0) && (this.carriers.length === 0);
    return this.uploadPossible;
  }

  private isSelectedRealm(): boolean {
    return localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null &&
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM) !== '';
  }

  hasRole(): RoleService {
    return this.role;
  }
}
