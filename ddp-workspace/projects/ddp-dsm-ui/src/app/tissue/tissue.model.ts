import {TissueSmId} from './sm-id.model';

export class Tissue {

  constructor(public tissueId: string, public oncHistoryDetailId: string, public notes: string, public countReceived: number,
              public tissueType: string, public tissueSite: string, public tumorType: string,
              public hE: string, public pathologyReport: string, public collaboratorSampleId: string, public blockSent: string,
              public scrollsReceived: string, public skId: string, public smId: string, public sentGp: string, public firstSmId: string,
              public additionalValuesJson: {}, public expectedReturn: string, public returnDate: string,
              public returnFedexId: string, public blockIdShl: string, public shlWorkNumber: string, public tissueSequence: string,
              public tumorPercentage: string,
              public scrollsCount: number, public ussCount: number, public blocksCount: number, public hECount: number,
              public scrollSMId: Array<TissueSmId>, public ussSMId: Array<TissueSmId>, public HESMId: Array<TissueSmId>,
              public deleted: boolean) {

  }

  static parse(json): Tissue {
    let additionalValuesJson: {};
    let jsonData = json.dynamicFields;
    if (jsonData != null) {
      jsonData = '{' + jsonData.substring(1, jsonData.length - 1) + '}';
      additionalValuesJson = JSON.parse(jsonData);
    }
    return new Tissue(json.tissueId, json.oncHistoryDetailId, json.notes, json.countReceived, json.tissueType,
      json.tissueSite, json.tumorType, json.hE, json.pathologyReport, json.collaboratorSampleId, json.blockSent,
      json.scrollsReceived, json.skId, json.smId, json.sentGp, json.firstSmId, additionalValuesJson, json.expectedReturn,
      json.returnDate, json.returnFedexId, json.blockIdShl, json.shlWorkNumber, json.tissueSequence, json.tumorPercentage,
      json.scrollsCount, json.ussCount, json.blocksCount, json.hECount,
      TissueSmId.parseArray(json.scrollSMID), TissueSmId.parseArray(json.ussSMID), TissueSmId.parseArray(json.heSMID),
      json.deleted);
  }
}
