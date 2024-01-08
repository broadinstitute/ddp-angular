export class PhiManifestModel {
    constructor(public shortId: string, public firstName: string, public lastName: string,
                public proxyFirstName: string, public proxyLastName: string, public dateOfBirth: string,
                public gender: string, public dateOfPx: string, public facility: string, public sampleType: string,
                public accessionNumber: string, public histology: string, public mfBarcode: string,
                public normalCollaboratorSampleId: string, public blockId: string,
                public tumorCollaboratorSampleId: string, public tissueSite: string, public sequencingResults: string,
                public somaticAssentAddendumResponse: string, public somaticConsentTumorPediatricResponse: string,
                public somaticConsentTumorResponse: string, public clinicalOrderDate: string,
                public clinicalOrderId: string, public clinicalPdoNumber: string, public orderStatus: string,
                public orderStatusDate: string) {
    }

    static parse(json): PhiManifestModel {
        return new PhiManifestModel(json.shortId, json.firstName, json.lastName, json.proxyFirstName,
            json.proxyLastName, json.dateOfBirth, json.gender, json.dateOfPx, json.facility, json.sampleType,
            json.accessionNumber, json.histology, json.mfBarcode, json.normalCollaboratorSampleId, json.blockId,
            json.tumorCollaboratorSampleId, json.tissueSite, json.sequencingResults, json.somaticAssentAddendumResponse,
            json.somaticConsentTumorPediatricResponse, json.somaticConsentTumorResponse, json.clinicalOrderDate,
            json.clinicalOrderId, json.clinicalPdoNumber, json.orderStatus, json.orderStatusDate);
    }

    public getReportAsMap(headers: string[], data: string[]): any {
      const map: Map<string, string> = new Map();
      for (let i = 0; i < headers.length; i++) {
        map[headers[i]] = data[i];
      }
      return map;
    }
}
