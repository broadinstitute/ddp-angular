import {Address} from '../address/address.model';

export class KitRequest {
  constructor( public participantId: string, public collaboratorParticipantId: string, public bspCollaboratorSampleId: string,
               public realm: string, public kitTypeName: string, public dsmKitRequestId: string, public dsmKitId: string,
               public ddpLabel: string, public labelUrlTo: string, public labelUrlReturn: string,
               public trackingNumberTo: string, public trackingReturnId: string, public trackingUrlTo: string,
               public trackingUrlReturn: string, public scanDate: number, public error: boolean, public message: string,
               public receiveDate: number, public deactivatedDate: number, public deactivationReason: string, public participant: Address,
               public easypostAddressId: string, public nameLabel: string, public kitLabel: string, public express: boolean,
               public labelDate: number, public noReturn: boolean, public externalOrderNumber: string,
               public externalOrderStatus: string, public preferredLanguage: string,
               public receiveDateString: string, public hruid: string, public gender: string, public collectionDate: string ) {
  }

  public TRACKING_LINK = 'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=';

  public isSelected = false;
  public setSent = false;

  static parse( json ): KitRequest {
    return new KitRequest(
      json.participantId, json.collaboratorParticipantId, json.bspCollaboratorSampleId, json.realm, json.kitTypeName,
      json.dsmKitRequestId, json.dsmKitId,
      json.ddpLabel, json.labelUrlTo, json.labelUrlReturn,
      json.trackingNumberTo, json.trackingReturnId, json.trackingUrlTo,
      json.trackingUrlReturn, json.scanDate, json.error, json.message,
      json.receiveDate, json.deactivatedDate, json.deactivationReason, json.participant, json.easypostAddressId, json.nameLabel,
      json.kitLabel, json.express, json.labelDate, json.noReturn, json.externalOrderNumber, json.externalOrderStatus,
      json.preferredLanguage, json.receiveDateString, json.hruid, json.gender, json.collectionDate
    );
  }

  static removeUnselectedKitRequests(array: Array<KitRequest>): Array<KitRequest> {
    const cleanedKitRequests: Array<KitRequest> = [];
    for (const kit of array) {
      if (kit.isSelected) {
        cleanedKitRequests.push(kit);
      }
    }
    return cleanedKitRequests;
  }

  public getID(): any {
    if (this.collaboratorParticipantId != null && this.collaboratorParticipantId !== '') {
      const idSplit: string[] = this.collaboratorParticipantId.split('_');
      if (idSplit.length === 2) {
        return idSplit[ 1 ];
      }
      if (idSplit.length > 2) { // RGP
        return this.collaboratorParticipantId.slice(this.collaboratorParticipantId.indexOf('_') + 1);
      }
    }
    if (this.participant != null && this.participant.shortId !== '') {
      return this.participant.shortId;
    }
    return this.collaboratorParticipantId;
  }

  public getShippingIdOrError(): any {
    if (this.error) {
      if (this.participant != null) {
        if (this.participant.country != null && this.participant.country === 'CA') {
          return 'Canadian Participant';
        }
        if (this.participant.street1 != null && this.participant.street1.toLowerCase().startsWith('po box')) {
          return 'Participant w/ PO Box';
        }
      }
      return this.message;
    } else {
      return this.ddpLabel;
    }
  }

  public getError(): string {
    if (this.error) {
      if (this.participant != null) {
        if (this.participant.country != null && this.participant.country === 'CA') {
          return 'Canadian Participant';
        }
        if (this.participant.street1 != null && this.participant.street1.toLowerCase().startsWith('po box')) {
          return 'Participant w/ PO Box';
        }
      }
      return this.message;
    }
    return '';
  }

  getScannedTrackingUrl(trackingNumber: string): string {
    return this.TRACKING_LINK + trackingNumber;
  }
}

// eslint-disable-next-line max-classes-per-file
export class TriggerLabel {
  constructor(public dsmKitRequestId: string, public dsmKitId: string) {
    this.dsmKitRequestId = dsmKitRequestId;
    this.dsmKitId = dsmKitId;
  }
}
