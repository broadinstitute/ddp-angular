import {TissueModel} from './tissue.model';

export interface OncHistoryDetailModel {
  participantId: string;
  oncHistoryDetailId: string;
  medicalRecordId: string;
  datePx: string;
  typePx: string;
  locationPx: string;
  histology: string;
  accessionNumber: string;
  facility: string;
  phone: string;
  fax: string;
  notes: string;
  request: string;
  faxSent: string;
  faxSentBy: string;
  faxConfirmed: string;
  faxSent2: string;
  faxSent2By: string;
  faxConfirmed2: string;
  faxSent3: string;
  faxSent3By: string;
  faxConfirmed3: string;
  tissueReceived: string;
  gender: string;
  additionalValuesJson: object;
  tissues: TissueModel[];
  tissueProblemOption: string;
  destructionPolicy: string;
  unableObtainTissue: boolean;
  numberOfRequests: number;
}
