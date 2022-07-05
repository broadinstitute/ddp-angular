export class UploadResponse {
  constructor(public invalidKitAddressList: string[], public duplicateKitList: string[], public specialKitList: string[],
              public specialMessage: string) {
    this.invalidKitAddressList = invalidKitAddressList;
    this.duplicateKitList = duplicateKitList;
    this.specialKitList = specialKitList;
    this.specialMessage = specialMessage;
  }

  static parse(json): UploadResponse {
    return new UploadResponse(json.invalidKitAddressList, json.duplicateKitList, json.specialKitList, json.specialMessage);
  }
}

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
