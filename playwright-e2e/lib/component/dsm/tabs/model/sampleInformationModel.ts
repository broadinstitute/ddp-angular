export default class SampleInformation {
  constructor(
    public type: string = '',
    public status: string = '',
    public kitUploadType: string = '',
    public normalCollaboratorSampleId: string = '',
    public MFBarcode: string = '',
    public sent: string = '',
    public received: string = '',
    public deactivated: string = '',
    public results: string = '',
    public collectionDate: string = '',
    public sequencingRestrictions: string = '',
    public sampleNotes: string = '',
  ) {}
}
