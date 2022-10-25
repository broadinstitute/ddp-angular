import {Component, OnInit} from '@angular/core';
import {ScanValue} from '../scan/scan.model';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {PatchUtil} from '../utils/patch.model';
import {Statics} from '../utils/statics';
import {DSMService} from '../services/dsm.service';
import {KitRequest} from '../shipping/shipping.model';
import {RoleService} from '../services/role.service';

@Component({
  selector: 'app-shipping-search',
  templateUrl: './shipping-search.component.html',
  styleUrls: ['./shipping-search.component.css']
})
export class ShippingSearchComponent implements OnInit {
  errorMessage: string;
  additionalMessage: string;
  isSaved: boolean = false;
  searchValue: string = null;
  searchField: string = null;
  searching = false;
  allowedRealms: string[] = [];
  kit: KitRequest[] = [];
  private currentPatchField: string;

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

  //Triggers when user finishes typing
  valueChanged( value: any, parameterName: string, kitRequest: KitRequest ): void {
    let v;

    
    if (typeof value === 'string') {
      kitRequest[ parameterName ] = value;
      v = value;
    }
    if (v != null) {
      const realm: string = kitRequest.realm;
      const patch1 = new PatchUtil(
        kitRequest.dsmKitRequestId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'dsmKitRequestId', kitRequest.dsmKitRequestId,
        'kit', null, realm, kitRequest.participantId
      );
      const patch = patch1.getPatch();
      this.currentPatchField = parameterName;
      this.patch( patch );
    }
  }

  patch( patch: any ): void {
    this.dsmService.patchParticipantRecord( JSON.stringify( patch ) ).subscribe( { // need to subscribe, otherwise it will not send!
      next: data => {
        this.currentPatchField = null;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          
          this.auth.logout();
        }
      },
      complete: () =>{
        this.isSaved = true;
      }
    } );
  }

  isPatchedCurrently( field: string ): boolean {
    return this.currentPatchField === field;
  }


  //This function only exists to hide the "Message Saved Successfully!"
  //if someone changes the date more then once
  changingDate(): void{
    this.isSaved = false;
  }
}