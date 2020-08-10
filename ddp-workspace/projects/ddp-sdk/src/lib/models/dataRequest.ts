export type DataRequestOptions = 'copy' | 'update' | 'delete' | 'other';

export interface DataRequest {
  option: DataRequestOptions;
  otherText?: string;
}
