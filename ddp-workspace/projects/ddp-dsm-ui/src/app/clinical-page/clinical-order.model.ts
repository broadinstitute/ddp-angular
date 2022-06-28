export class ClinicalOrder {
  isSelected: boolean = false;

  constructor( public shortId: string, public sample: string, public orderId: string,
               public orderDate: string, public statusDetail: string, public sampleType: string ) {
    this.shortId = shortId;
    this.sample = sample;
    this.orderId = orderId;
    this.orderDate = orderDate;
    this.statusDetail = statusDetail;
    this.sampleType = sampleType;
  }

  public static parse( json ): ClinicalOrder {
    return new ClinicalOrder( json.shortId, json.sample, json.orderId, json.orderDate, json.statusDetail, json.sampleType );
  }
}
