export default class SequencingOrder {
  constructor(
    public sampleType: string = '',
    public sample: string = '',
    public sampleStatus: string = '',
    public collectionDate: string = '',
    public latestSequencingOrderDate: string = '',
    public latestOrderStatus: string = '',
    public latestOrderNumber: string = '',
    public latestPdoNumber: string = '',
  ) {}
}
