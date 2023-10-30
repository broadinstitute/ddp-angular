export default class SequencingOrder {
  public sampleType: string;
  public sample: string;
  public sampleStatus: string;
  public collectionDate: string;
  public latestSequencingOrderDate: string;
  public latestOrderStatus: string;
  public latestOrderNumber: string;
  public latestPdoNumber: string;

  constructor() {
    this.sampleType = '';
    this.sample = '';
    this.sampleStatus = '';
    this.collectionDate = '';
    this.latestSequencingOrderDate = '';
    this.latestOrderStatus = '';
    this.latestOrderNumber = '';
    this.latestPdoNumber = '';
  }
}
