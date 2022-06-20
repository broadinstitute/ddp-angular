import {Component, Input, OnInit} from '@angular/core';
import {Participant} from '../participant-list/participant-list.model';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {PatchUtil} from '../utils/patch.model';
import {SequencingOrder} from './sequencing-order.model';

@Component( {
  selector: 'app-sequencing-order',
  templateUrl: './sequencing-order.component.html',
  styleUrls: [ './sequencing-order.component.scss' ]
} )
export class SequencingOrderComponent implements OnInit {
  @Input() participant: Participant;
  @Input() samples: SequencingOrder[];

  private currentPatchField: string;

  constructor( private dsmService: DSMService, private auth: Auth, private role: RoleService ) {

  }

  ngOnInit(): void {
  }

  valueChanged( value: any, parameterName: string, sample: SequencingOrder ): void {
    let v;

    if (typeof value === 'string') {
      sample[ parameterName ] = value;
      v = value;
    }
    if (v != null) {
      const realm: string = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
      const patch1 = new PatchUtil(
        sample.sampleId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'dsmKitRequestId', sample.sampleId,
        'kit', null, realm, null
      );
      const patch = patch1.getPatch();
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
      }
    } );
  }

  isPatchedCurrently( field: string ) {
    return this.currentPatchField === field;
  }

  shouldHaveCheckbox( sample: SequencingOrder ) {
    return ( sample.sampleStatus === 'Received' && sample.sampleType === 'Normal' )
      || ( sample.sampleStatus.toLowerCase() === 'sent to gp' && sample.sampleType === 'Tumor' );
  }

  submitOrders() {
    const orders = [];
    this.samples.forEach( sample => {
      if (sample.isSelected) {
        orders.push( sample );
      }
    } );
    console.log( orders );
  }
}
