export class SequencingOrder {
  isSelected: boolean = false;

  constructor( public sampleType: string, public sample: string, public sampleStatus: string, public collectionDate: string,
               public sequencingOrderDate: string, public tissueId: string, public dsmKitRequestId: string ) {
    this.sampleType = sampleType;
    this.sample = sample;
    this.sampleStatus = sampleStatus;
    this.collectionDate = collectionDate;
    this.sequencingOrderDate = sequencingOrderDate;
    this.tissueId = tissueId;
    this.dsmKitRequestId = dsmKitRequestId;
  }

  public static parse( json ): SequencingOrder {
    return new SequencingOrder( json.sampleType, json.sample, json.sampleStatus, json.collectionDate, json.sequencingOrderDate,
      json.tissueId, json.dsmKitRequestId );
  }
}
