import { TestResult } from './test-result.model';

export class Sample {
  static DEACTIVATED = 'deactivated';
  static SENT = 'shipped';
  static RECEIVED = 'received';
  static IN_QUEUE = 'queue';
  static IN_ERROR = 'error';

  constructor(public bspCollaboratorSampleId: string, public kitTypeName: string, public scanDate: number, public error: boolean,
              public receiveDate: number, public deactivatedDate: number, public trackingNumberTo: string,
              public trackingReturnId: string, public kitLabel: string, public testResult: Array<TestResult>,
               public upsTrackingStatus: string, public upsReturnStatus: string, public externalOrderStatus: string,
              public externalOrderNumber: string, public externalOrderDate: number,
               public careEvolve: boolean, public uploadReason: string, public collectionDate: string,
              public sequencingRestriction: string, public dsmKitRequestId: string, public sampleNotes: string,
              public bspCollaboratorParticipantId: string
  ) {
    if (this.uploadReason === '' || this.uploadReason === null || this.uploadReason === undefined) {
      this.uploadReason = 'NORMAL';
    }
  }

  get sampleQueue(): string {
    if (this.externalOrderStatus !== null && this.externalOrderStatus !== undefined) {
      return this.externalOrderStatus + ' (GBF)';
    }
    if (this.deactivatedDate !== undefined) {
      return Sample.DEACTIVATED;
    }
    if (this.receiveDate !== undefined) {
      return Sample.RECEIVED;
    }
    if (this.scanDate !== undefined) {
      return Sample.SENT;
    }
    if (this.error) {
      return Sample.IN_ERROR;
    }
    return Sample.IN_QUEUE;
  }

  static parse(json): Sample {
    let testResults: Array<TestResult> = null;
    if (json.testResult != null) {
      const tmp: any = JSON.parse(String(json.testResult));
      if (tmp != null) {
        testResults = [];
        tmp.forEach((val) => {
          const testResult = TestResult.parse(val);
          testResults.push(testResult);
        });
      }
    }
    return new Sample(
      json.bspCollaboratorSampleId, json.kitTypeName, json.scanDate, json.error, json.receiveDate, json.deactivatedDate,
      json.trackingNumberTo, json.trackingReturnId, json.kitLabel, testResults, json.upsTrackingStatus,
      json.upsReturnStatus, json.externalOrderStatus, json.externalOrderNumber, json.externalOrderDate,
      json.careEvolve, json.uploadReason, json.collectionDate, json.sequencingRestriction, json.dsmKitRequestId, json.sampleNotes,
      json.bspCollaboratorParticipantId
    );
  }
}
