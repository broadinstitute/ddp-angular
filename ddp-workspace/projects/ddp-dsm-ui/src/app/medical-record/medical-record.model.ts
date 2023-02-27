import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import { FollowUp } from '../follow-up/follow-up.model';
import {MedicalProviderModel} from '../models';

export class MedicalRecord {
  constructor(public medicalRecordId?: string, public participantId?: string, public institutionId?: string,
              public ddpInstitutionId?: string, public name?: string,
              public contact?: string, public phone?: string, public fax?: string,
              public faxSent?: string, public faxSentBy?: string, public faxConfirmed?: string,
              public faxSent2?: string, public faxSent2By?: string, public faxConfirmed2?: string,
              public faxSent3?: string, public faxSent3By?: string, public faxConfirmed3?: string,
              public mrReceived?: string, public mrDocument?: string, public mrDocumentFileNames?: string,
              public mrProblem?: boolean, public mrProblemText?: string, public unableObtain?: boolean, public duplicate?: boolean,
              public international?: boolean, public crRequired?: boolean, public pathologyPresent?: string,
              public notes?: string, public reviewMedicalRecord?: boolean, public type?: string, public nameDDP?: string,
              public institutionDDP?: string, public streetAddressDDP?: string, public cityDDP?: string, public stateDDP?: string,
              public isDeleted?: boolean, public oncHistoryDetail?: Array<OncHistoryDetail>, public followUps?: FollowUp[],
              public followupRequired?: boolean, public followupRequiredText?: string, public additionalValuesJson?: {},
              public unableObtainText?: string) {
    this.followUps = followUps == null ? [] : followUps;
  }

  get mrStatus(): string {
    return this.getMRStatus();
  }

  private NEW = 'New';
  private SENT = 'Fax Sent';
  private RECEIVED = 'MR Received';
  private UNABLE = 'Unable To Obtain';
  private REMOVED = 'Removed';
  private DUPLICATE = 'Duplicate';
  private INTERNATIONAL = 'International';

  private PHYSICIAN = 'PHYSICIAN';
  private INSTITUTION = 'INSTITUTION';
  private INITIALBIOPSY = 'INITIAL_BIOPSY';

  public changedBy: string;

  static parse(json, medicalProvider?: MedicalProviderModel): MedicalRecord {
    const result: FollowUp[] = [];
    const jsonArray = json.followUps;
    if (jsonArray !== undefined) {
      jsonArray.forEach((jsonItem) => {
        result.push(new FollowUp(
          jsonItem.fRequest1 == null ? null : jsonItem.fRequest1,
          jsonItem.fRequest2 == null ? null : jsonItem.fRequest2,
          jsonItem.fRequest3 == null ? null : jsonItem.fRequest3,
          jsonItem.fReceived == null ? null : jsonItem.fReceived
        ));
      });
    }
    let data = json.dynamicFields;
    let additionalValuesJson = {};
    if (data != null) {
      data = '{' + data.substring(1, data.length - 1) + '}';
      additionalValuesJson = JSON.parse(data);
    }
    return new MedicalRecord(json.medicalRecordId, json.participantId, json.institutionId, json.ddpInstitutionId, json.name,
      json.contact, json.phone, json.fax,
      json.faxSent, json.faxSentBy, json.faxConfirmed,
      json.faxSent2, json.faxSent2By, json.faxConfirmed2,
      json.faxSent3, json.faxSent3By, json.faxConfirmed3,
      json.mrReceived, json.mrDocument, json.mrDocumentFileNames,
      json.mrProblem, json.mrProblemText, json.unableObtain, json.duplicate, json.international, json.crRequired,
      json.pathologyPresent,
      json.notes, json.reviewMedicalRecord, medicalProvider?.type, json.nameDDP,
      json.institutionDDP, json.streetAddressDDP, json.cityDDP, json.stateDDP,
      json.isDeleted, json.oncHistoryDetails, result,
      json.followupRequired, json.followupRequiredText, additionalValuesJson, json.unableObtainText);
  }

  getMRStatus(): string {
    if (this.duplicate) {
      return this.DUPLICATE;
    } else if (this.unableObtain) {
      return this.UNABLE;
    } else if (this.international) {
      return this.INTERNATIONAL;
    } else {
      if (this.mrReceived != null && this.mrReceived !== '') {
        return this.RECEIVED;
      } else if (this.faxSent != null && this.faxSent !== '') {
        return this.SENT;
      } else {
        return this.NEW;
      }
    }
  }

  getName(): string {
    if (this.isDeleted) {
      return this.REMOVED;
    } else {
      if (this.name != null && this.name !== '') {
        return this.name;
      } else {
        if (this.PHYSICIAN === this.type) {
          return this.nameDDP;
        } else {
          return this.institutionDDP;
        }
      }
    }
  }

  getType(): string {
    if (this.PHYSICIAN === this.type) {
      return 'Physician';
    } else if (this.INSTITUTION === this.type) {
      return 'Institution';
    } else if (this.INITIALBIOPSY === this.type) {
      return 'Initial Biopsy';
    }
    return '';
  }

  getFollowUpValue(name: string, i: number): any {
    if (i > this.followUps.length) {
      return null;
    }
    return this.followUps[ i ][ name ];
  }

  showInstitution(): boolean {
    return this.PHYSICIAN === this.type || this.INSTITUTION === this.type || this.INITIALBIOPSY === this.type;
  }

  getParticipantEnteredAddress(): string {
    let address = '';
    if (this.nameDDP) {
      address += this.nameDDP;
    }
    if (this.institutionDDP) {
      address += this.addLineBreak(address);
      address += this.institutionDDP;
    }
    if (this.streetAddressDDP) {
      address += this.addLineBreak(address);
      address += this.streetAddressDDP;
    }
    if (this.cityDDP && this.stateDDP) {
      // both are not empty, so add them both
      address += this.addLineBreak(address);
      address += this.cityDDP + ' ' + this.stateDDP;
    } else {
      // one is not empty, so add that one
      if (this.cityDDP) {
        address += this.addLineBreak(address);
        address += this.cityDDP;
      }
      if (this.stateDDP) {
        address += this.addLineBreak(address);
        address += this.stateDDP;
      }
    }
    return address;
  }

  addLineBreak(address: string): string {
    if (address) {
      return '\n';
    }
    return '';
  }


}
