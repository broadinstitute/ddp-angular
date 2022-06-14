import {TissueSmIdModel} from "./tissueSmId.model";

export interface TissueModel {
  tissueId: string;
  oncHistoryDetailId: string;
  notes: string;
  countReceived: number;
  tissueType: string;
  tissueSite: string;
  tumorType: string;
  hE: string;
  pathologyReport: string;
  collaboratorSampleId: string;
  blockSent: string;
  scrollsReceived: string;
  skId: string;
  smId: string;
  sentGp: string;
  firstSmId: string;
  additionalValuesJson: object;
  expectedReturn: string;
  returnDate: string;
  returnFedexId: string;
  shlWorkNumber: string;
  tissueSequence: string;
  tumorPercentage: string;
  scrollsCount: number;
  ussCount: number;
  blocksCount: number;
  hECount: number;
  scrollSMId: TissueSmIdModel[];
  ussSMId: TissueSmIdModel[];
  HESMId: TissueSmIdModel[];
}
