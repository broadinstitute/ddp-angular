import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { UploadParticipant } from './stool-upload.model';
import { KitType } from '../utils/kit-type.model';
import { ModalComponent } from '../modal/modal.component';
import { ComponentService } from '../services/component.service';
import { Statics } from '../utils/statics';
import { FieldFilepickerComponent } from '../field-filepicker/field-filepicker.component';
import {finalize} from 'rxjs/operators';

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
  notAllowed = false;
  isLoading = true;
  additionalMessage: string;
  resultMessage: string;

  loading = false;

  kitTypes: Array<KitType> = [];
  kitType: KitType;

  file: File = null;

  failedParticipants: Array<UploadParticipant> = [];

  realmNameStoredForFile: string;
  allowedToSeeInformation = false;

  constructor( private dsmService: DSMService, private auth: Auth, private compService: ComponentService, private route: ActivatedRoute) {
    !auth.authenticated() && auth.sessionLogout();
    this.realmNameStoredForFile = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    this.route.queryParams.subscribe(params => {
      const realm = params[ DSMService.REALM ] || null;
      !!realm && this.checkRight();
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
          if (this.selectedRealm === val) {
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
    if (this.selectedRealm != null) {
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
      this.dsmService.getKitTypes(this.selectedRealm).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: data => {
          this.kitTypes = [];
          jsonData = data;
          jsonData.forEach((val) => {
            const kitType = KitType.parse(val);
            if(kitType.name ==='STOOL'){
              this.kitTypes.push(kitType);
            }
          });
          if (this.kitTypes.length === 1) {
            this.kitType = this.kitTypes[ 0 ];
          } else {
            this.notAllowed = true;
          }
          this.loading = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
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
      this.selectedRealm, this.kitType.name,
      this.file
    ).pipe(
      finalize(() => this.loading = false)
    )
      .subscribe({
        next: data => {
          this.resultMessage = data;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.sessionLogout();
          }
          this.errorMessage = err.error;
        },
      });
  }

  fileSelected(file: File): void {
    this.file = file;
  }


  private isSelectedRealm(): boolean {
    return !!this.selectedRealm;
  }

  private get selectedRealm(): string {
    return sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }

}
