export class ClinicalOrder {
  isSelected = false;

  constructor( public shortId: string, public sample: string, public orderId: string,
               public orderDate: string, public statusDetail: string, public sampleType: string, public orderStatus: string,
               public mercuryPdoId: string, public statusDate: string) {
  }

  public static parse( json ): ClinicalOrder {
    return new ClinicalOrder( json.shortId, json.sample, json.orderId, json.orderDate, json.statusDetail, json.sampleType,
      json.orderStatus, json.mercuryPdoId, json.statusDate );
  }
}
