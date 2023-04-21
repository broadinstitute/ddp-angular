import {Component, Input, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {Participant} from '../participant-list/participant-list.model';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {PatchUtil} from '../utils/patch.model';
import {Utils} from '../utils/utils';
import {SequencingOrder} from './sequencing-order.model';

@Component( {
  selector: 'app-sequencing-order',
  templateUrl: './sequencing-order.component.html',
  styleUrls: [ './sequencing-order.component.scss' ]
} )
export class SequencingOrderComponent {
  @Input() participant: Participant;
  @Input() samples: SequencingOrder[];

  @ViewChild( ModalComponent )
  public modal: ModalComponent;

  errorModal = false;

  currentPatchField: string;
  errorMessage: string;
  selectedNormal: SequencingOrder = new SequencingOrder();
  selectedTissue: SequencingOrder = new SequencingOrder();

  constructor( private dsmService: DSMService, private auth: Auth, private role: RoleService ) {

  }


  valueChanged( value: any, parameterName: string, sample: SequencingOrder ): void {
    let v;

    if (typeof value === 'string') {
      sample[ parameterName ] = value;
      v = value;
    }
    if (v != null) {
      const realm: string = sessionStorage.getItem( ComponentService.MENU_SELECTED_REALM );
      const patch1 = new PatchUtil(
        sample.dsmKitRequestId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'dsmKitRequestId', sample.dsmKitRequestId,
        'kit', null, realm, this.participant.data.profile[ 'guid' ]
      );
      const patch = patch1.getPatch();
      this.patch( patch );
    }
  }

  patch( patch: any ): void {
    this.dsmService.patchParticipantRecord( JSON.stringify( patch ) ).subscribe( {
      next: data => {
        this.currentPatchField = null;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
      }
    } );
  }

  isPatchedCurrently( field: string ): boolean {
    return this.currentPatchField === field;
  }

  shouldHaveCheckbox( sample: SequencingOrder ): boolean {
    return ( sample.sampleStatus === 'Received' && sample.sampleType === 'Normal' )
      || ( sample.sampleStatus.toLowerCase() === 'sent to gp' && sample.sampleType === 'Tumor' );
  }

  preSubmitOrder(): void {
    this.errorModal = false;
    this.modal.show();
    return;
  }

  submitOrders(): void {
    const orders = [];
    this.samples.forEach( sample => {
      if (sample.isSelected) {
        orders.push( sample );
      }
    } );
    const realm: string = sessionStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.dsmService.placeSeqOrder( orders, realm, this.participant.data.profile[ 'guid' ] ).subscribe();
    this.closeModal();
  }

  checkError(): string {
    this.errorMessage = '';
    let normalCount = 0;
    let tumorCount = 0;
    this.samples.forEach( sample => {
      if (sample.isSelected) {
        if (sample.sampleType === 'Normal') {
          normalCount++;
          this.selectedNormal = sample;
        }
        else {
          tumorCount++;
          this.selectedTissue = sample;
        }
      }
    } );
    if (tumorCount > 1) {
      this.errorMessage += 'Error: Only 1 tumor sample permitted per clinical order. ';
    }
    else if (normalCount > 1) {
      this.errorMessage += 'Error: Only 1 normal sample permitted per clinical order. ';
    }
    this.samples.forEach( sample => {
      if (sample.isSelected && !sample.collectionDate) {
        this.errorMessage += 'Error: One or more samples are missing collection date. ';
      }
    } );
    if (this.checkErrorInSurveys( 'RELEASE_SELF' ) || this.checkErrorInSurveys( 'RELEASE_MINOR' )) {
      this.errorMessage += 'Participant lives in New York or Canada and is not eligible for clinical sequencing ';
    }
    if (this.selectedNormal && this.selectedNormal.sequencingRestriction && this.selectedNormal.sequencingRestriction === 'RUO') {
      this.errorMessage += 'Error: The normal sample selected for the order cannot be used for clinical sequencing. ';
    }
    return this.errorMessage;
  }

  getDateFormatted( sequencingOrderDate: any ): string {
    return Utils.getLongDateFormatted( sequencingOrderDate );
  }

  checkErrorInSurveys( surveyName: string ): boolean {
    const releaseActivity = this.participant.data.activities.find( activity => activity.activityCode === surveyName );
    if (releaseActivity) {
      const stateQuestion = releaseActivity.questionsAnswers.find( questionAnswer => questionAnswer.stableId === 'ADDRESS_STATE' );
      if (stateQuestion && stateQuestion.answer) {
        const answer = stateQuestion.answer;
        if (answer === 'NY') {
          return true;
        }
      }
      const countryQuestion = releaseActivity.questionsAnswers.find( questionAnswer => questionAnswer.stableId === 'ADDRESS_COUNTRY' );
      if (countryQuestion && stateQuestion.answer) {
        const answer = stateQuestion.answer;
        if (answer === 'Canada') {
          return true;
        }
      }
    }
    return false;
  }

  closeModal(): void {
    this.modal.hide();
  }

  public canNotSubmitOrder(): boolean{
    return !this.role.allowedToDoOrderSequencing();
  }

  public canChangeCollectionDate(): boolean{
      return this.role.allowedToDoOrderSequencing() || this.role.allowToViewSampleLists();
    }
}
