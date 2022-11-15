import { Tissue } from '../tissue/tissue.model';


interface OncHistoryDetailsInterface {
  deleted: boolean;
  dynamicFields: string;
  faxConfirmed: string;
  faxConfirmed2: string;
  faxConfirmed3: string;
  faxSent: string;
  faxSent2: string;
  faxSent3: string;
  locationPx: string;
  request: string;
  tissues: Array<Tissue>;
  unableObtainTissue: boolean;
  participantId: string;
  oncHistoryDetailId: string;
  medicalRecordId: string;
  typePx: string;
  histology: string;
  accessionNumber: string;
  facility: string;
  phone: string;
  fax: string;
  notes: string;
  tissueProblemOption: string;
  destructionPolicy: string;
  faxSentBy: string;
  faxSent2By: string;
  faxSent3By: string;
  tissueReceived: string;
  gender: string;
  datePx: string;
  numberOfRequests: any;
}

export class OncHistoryDetail {
  changed = false;
  selected = false;

  changedBy: string;

  constructor(public participantId: string, public oncHistoryDetailId: string, public medicalRecordId: string,
              public datePx: string, public typePx: string,
              public locationPx: string, public histology: string, public accessionNumber: string, public facility: string,
              public phone: string, public fax: string, public notes: string, public request: string,
              public faxSent: string, public faxSentBy: string, public faxConfirmed: string,
              public faxSent2: string, public faxSent2By: string, public faxConfirmed2: string,
              public faxSent3: string, public faxSent3By: string, public faxConfirmed3: string,
              public tissueReceived: string, public gender: string,
              public additionalValuesJson: {}, public tissues: Array<Tissue>,
              public tissueProblemOption: string, public destructionPolicy: string, public unableObtainTissue: boolean,
              public numberOfRequests, public deleted: boolean = false) {

  }

  static parse(json: OncHistoryDetailsInterface): OncHistoryDetail {
    const tissues: Array<Tissue> = [];
    const jsonData = json.tissues;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const tissue = Tissue.parse(val);
        tissues.push(tissue);
      });
    }

    let data = json.dynamicFields;
    let additionalValuesJson = {};
    if (data != null) {
      data = '{' + data.substring(1, data.length - 1) + '}';
      additionalValuesJson = JSON.parse(data);
    }

    return new OncHistoryDetail(
      json.participantId, json.oncHistoryDetailId, json.medicalRecordId, json.datePx, json.typePx, json.locationPx,
      json.histology, json.accessionNumber, json.facility, json.phone, json.fax, json.notes, json.request,
      json.faxSent, json.faxSentBy, json.faxConfirmed,
      json.faxSent2, json.faxSent2By, json.faxConfirmed2,
      json.faxSent3, json.faxSent3By, json.faxConfirmed3,
      json.tissueReceived, json.gender, additionalValuesJson, tissues,
      json.tissueProblemOption, json.destructionPolicy, json.unableObtainTissue, json.numberOfRequests, json.deleted
    );
  }
}
