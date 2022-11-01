import {Component, OnInit} from '@angular/core';
import {Auth} from '../services/auth.service';
import { PatchUtil } from '../utils/patch.model';
import { Statics } from '../utils/statics';
import { DSMService } from '../services/dsm.service';
import { KitRequest } from '../shipping/shipping.model';
import { RoleService } from '../services/role.service';
import { Observable, defer } from 'rxjs';

@Component({
  selector: 'app-shipping-search',
  templateUrl: './shipping-search.component.html',
  styleUrls: ['./shipping-search.component.css']
})
export class ShippingSearchComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;
  searchValue: string | null = null;
  searchField: string | null = null;
  searching = false;
  allowedRealms: string[] = [];
  kit: KitRequest[] = [];
  private currentPatchField: string | null;

  constructor(private dsmService: DSMService, private auth: Auth, private role: RoleService) {
    if (!auth.authenticated()) {
      auth.logout();
    }
  }

  ngOnInit(): void {
    this.checkRight();
  }

  private checkRight(): void {
    this.allowedRealms = [];
    let jsonData: any[];
    this.dsmService.getRealmsAllowed(Statics.SHIPPING).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          this.allowedRealms.push(val);
        });
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
            this.auth.logout();
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
              this.auth.logout();
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
        name: "collectionDate",
        value: kitRequest.collectionDate
      }, null, 'dsmKitRequestId', kitRequest.dsmKitRequestId,
      'kit', null, realm, kitRequest.participantId
    );
    const patch = patch1.getPatch();
    this.currentPatchField = "collectionDate";
    return this.patch(patch);
  };
}