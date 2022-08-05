// eslint-disable-next-line max-classes-per-file
export class UploadParticipant {
  selected = false;

  constructor(public mfBarcode: string, public participantId: string, public receiveDate: string) {
    this.mfBarcode = mfBarcode;
    this.participantId = participantId;
    this.receiveDate = receiveDate;
  }

  static parse(json): UploadParticipant {
    return new UploadParticipant(json.mfBarcode, json.participantId, json.receiveDate);
  }
}
