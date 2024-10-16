import {Component, OnInit} from '@angular/core';
import {Auth} from '../services/auth.service';
import { PatchUtil } from '../utils/patch.model';
import { Statics } from '../utils/statics';
import { DSMService } from '../services/dsm.service';
import { KitRequest } from '../shipping/shipping.model';
import { RoleService } from '../services/role.service';
import { Observable, defer } from 'rxjs';
import { ComponentService } from '../services/component.service';

@Component({
  selector: 'app-shipping-search',
  templateUrl: './shipping-search.component.html',
  styleUrls: ['./shipping-search.component.css']
})
export class ShippingSearchComponent implements OnInit {
  realm: string;
  errorMessage: string;
  additionalMessage: string;
  searchValue: string | null = null;
  searchField: string | null = null;
  searching = false;
  allowedRealms: string[] = [];
  kit: KitRequest[] = [];
  private currentPatchField: string | null;
  PECGS_RESEARCH = 'PECGS_RESEARCH';
  disabled = true;

  constructor(private dsmService: DSMService, private auth: Auth, private role: RoleService, private compService: ComponentService) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    } else {
      this.errorMessage = 'Please select a study';
    }
    this.checkRight();
  }

  private checkRight(): void {
    let allowedToSeeInformation = false;
    this.allowedRealms = [];
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.SHIPPING).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
            allowedToSeeInformation = true;
            this.allowedRealms.push(val);
            this.disabled = false;
          }
        });
        if (!allowedToSeeInformation) {
          this.errorMessage = 'You are not allowed to see kit information of the selected study';
        }
      },
      error: () => null
    });
  }

  searchKit(): void {
    if (this.allowedRealms != null && this.allowedRealms.length > 0) {
      this.searching = true;
      this.kit = [];
      this.errorMessage = null;
      this.additionalMessage = null;
      let jsonData: any[];
      this.dsmService.getKit(this.searchField, this.searchValue, this.allowedRealms).subscribe({
        next: data => {
          jsonData = data;
          jsonData.forEach((val) => {
            this.kit.push(KitRequest.parse(val));
          });
          if (this.kit == null || this.kit.length < 1) {
            this.additionalMessage = 'Kit was not found.';
          }
          this.searching = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
          this.errorMessage = 'Error - Loading ddp information\nPlease contact your DSM developer';
          this.searching = false;
        }
      });
    } else {
      this.additionalMessage = 'You are not allowed to see kit information';
    }
  }

  getRole(): RoleService {
    return this.role;
  }

  showColumn(name: string): boolean {
    if (this.kit != null) {
      const foundColumn = this.kit.find(kit => (kit[name] != null && kit[name] !== '' && kit[name] !== 0));
      if (foundColumn != null) {
        return true;
      }
    }
    return false;
  }

  receiveATKit(kitRequest: KitRequest): void {
    let jsonData: any[];
    const scanPayloads = [];
    scanPayloads.push({
      kitLabel: kitRequest.kitLabel
    });
    this.dsmService.setKitReceivedRequest(JSON.stringify(scanPayloads))
      .subscribe({
          next: data => {
            let failedSending = false;
            jsonData = data;
            jsonData.forEach((val) => {
              failedSending = true;
            });
            if (!failedSending) {
              this.searchKit();
            }
          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.auth.doLogout();
            }
            this.errorMessage = 'Error - Loading ddp information\nPlease contact your DSM developer';
            this.searching = false;
          }
        }
      ); // need to subscribe, otherwise it will not send!
  }

  patch(patch: any): Observable<any> {
    return this.dsmService.patchParticipantRecord(JSON.stringify(patch));
  }

//Triggers when user finishes typing
valueChanged(value: any, parameterName: string, kitRequest: KitRequest): void {
  if (typeof value === 'string') {
    kitRequest[parameterName] = value;
  }
}

saveCompleted(): void{
  this.currentPatchField = null;
}

  //Fires when user clicks "Save Date" button. Returns an
  //observable that signals whether or not the request succeeded
  saveDate(kitRequest: KitRequest): Observable<boolean> {
    const realm: string = kitRequest.realm;
    const patch1 = new PatchUtil(
      kitRequest.dsmKitRequestId, this.role.userMail(),
      {
        name: 'collectionDate',
        value: kitRequest.collectionDate
      }, null, 'dsmKitRequestId', kitRequest.dsmKitRequestId,
      'kit', null, realm, kitRequest.participantId
    );
    const patch = patch1.getPatch();
    this.currentPatchField = 'collectionDate';
    return this.patch(patch);
  }

  isResearchStudy(kitRequest: KitRequest): boolean {
    if (kitRequest.realm === 'osteo2' || kitRequest.realm === 'cmi-lms') {
      return true;
    }
    return false;
  }

  isResearchSample(kitRequest: KitRequest): boolean {
    if (kitRequest.realm === 'osteo2' || kitRequest.realm === 'cmi-lms') {
      return (kitRequest.message && kitRequest.message.includes(this.PECGS_RESEARCH));
    }
    return false;
  }

  get buttonDisabled(): boolean {
    return this.disabled || this.searchField == null || this.searchValue == null || !this.searchValue.trim().length;
  }
}
