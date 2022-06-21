export class SequencingOrder {
  isSelected: boolean = false;

  constructor( public sampleType: string, public sample: string, public sampleStatus: string, public collectionDate: string,
               public sequencingOrderDate: string, public sampleId: string ) {
    this.sampleType = sampleType;
    this.sample = sample;
    this.sampleStatus = sampleStatus;
    this.collectionDate = collectionDate;
    this.sequencingOrderDate = sequencingOrderDate;
    this.sampleId = sampleId;
  }

  public static parse( json ): SequencingOrder {
    return new SequencingOrder( json.sampleType, json.sample, json.sampleStatus, json.collectionDate, json.sequencingOrderDate, json.sampleId );
  }
}
