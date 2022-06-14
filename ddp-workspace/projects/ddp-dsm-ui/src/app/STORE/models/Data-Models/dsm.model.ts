import {PdfsModel} from './pdfs.model';

export interface DsmModel {
  dateOfBirth: string;
  dateOfMajority: string;
  hasConsentedToBloodDraw: boolean;
  hasConsentedToTissueSample: boolean;
  kitRequestShipping: any[];
  medicalRecord: any[];
  oncHistoryDetails: any[];
  participantData: [];
  pdfs: PdfsModel[];
  tissue: any[];
}
