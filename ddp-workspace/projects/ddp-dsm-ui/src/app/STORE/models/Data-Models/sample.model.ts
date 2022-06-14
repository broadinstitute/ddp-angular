import {TestResultModel} from "./testResult.model";

export interface SampleModel {
  bspCollaboratorSampleId: string;
  kitTypeName: string;
  scanDate: number;
  error: boolean;
  receiveDate: number;
  deactivatedDate: number;
  trackingNumberTo: string;
  trackingReturnId: string;
  kitLabel: string;
  testResult: TestResultModel[];
  upsTrackingStatus: string;
  upsReturnStatus: string;
  externalOrderStatus: string;
  externalOrderNumber: string;
  externalOrderDate: number;
  careEvolve: boolean;
  uploadReason: string;
}
