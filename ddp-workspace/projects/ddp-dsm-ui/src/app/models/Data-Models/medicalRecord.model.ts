import {OncHistoryDetailModel} from './oncHistoryDetail.model';
import {FollowUpModel} from './followUp.model';

export interface MedicalRecordModel {
  medicalRecordId: string;
  participantId: string;
  institutionId: string;
  ddpInstitutionId: string;
  name: string;
  contact: string;
  phone: string;
  fax: string;
  faxSent: string;
  faxSentBy: string;
  faxConfirmed: string;
  faxSent2: string;
  faxSent2By: string;
  faxConfirmed2: string;
  faxSent3: string;
  faxSent3By: string;
  faxConfirmed3: string;
  mrReceived: string;
  mrDocument: string;
  mrDocumentFileNames: string;
  mrProblem: boolean;
  mrProblemText: string;
  unableObtain: boolean;
  duplicate: boolean;
  international: boolean;
  crRequired: boolean;
  pathologyPresent: string;
  notes: string;
  reviewMedicalRecord: boolean;
  type: string;
  nameDDP: string;
  institutionDDP: string;
  streetAddressDDP: string;
  cityDDP: string;
  stateDDP: string;
  isDeleted: boolean;
  oncHistoryDetail: OncHistoryDetailModel[];
  followUps: FollowUpModel[];
  followupRequired: boolean;
  followupRequiredText: string;
  additionalValuesJson: object;
  unableObtainText: string;
}
