export class SequencingOrder {
  isSelected = false;

  constructor( public sampleType: string, public sample: string, public sampleStatus: string, public collectionDate: string,
               public sequencingOrderDate: string, public tissueId: string, public dsmKitRequestId: string,
               public sequencingRestriction: string ) {

  }

  public static parse( json ): SequencingOrder {
    return new SequencingOrder( json.sampleType, json.sample, json.sampleStatus, json.collectionDate, json.sequencingOrderDate,
      json.tissueId, json.dsmKitRequestId, json.sequencingRestriction );
  }

  public static getEmptyInstance(): SequencingOrder{
    return new SequencingOrder( '', '', '', '', '', '', '', '' );
  }

}