export class ParticipantData {
  constructor(public participantDataId: string, public fieldTypeId: string, public data: {}) {
    this.participantDataId = participantDataId;
    this.fieldTypeId = fieldTypeId;
    this.data = data;
  }

  static parse(json): ParticipantData {
    let data = {};
    if (json.data != null) {
      data = JSON.parse(json.data);
    }
    return new ParticipantData(json.participantDataId, json.fieldTypeId, data);
  }
}
