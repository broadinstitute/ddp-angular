export class ParticipantDSMInformation {

  constructor(public participantId: string, public ddpParticipantId: string, public realm: string,
              public assigneeIdMr: string, public assigneeIdTissue: string, public createdOncHistory: string,
              public reviewedOncHistory: string, public crSent: string, public crReceived: string, public notes: string,
              public minimalMr: boolean, public abstractionReady: boolean, public mrNeedsAttention: boolean,
              public tissueNeedsAttention: boolean, public exitDate: number, public additionalValuesJson: {} ) {
  }

  static parse( json ): ParticipantDSMInformation {
    let data = json.dynamicFields;
    let additionalValuesJson = {};
    if (data != null) {
      data = '{' + data.substring(1, data.length - 1) + '}';
      additionalValuesJson = JSON.parse(data);
    }
    return new ParticipantDSMInformation( json.participantId, json.ddpParticipantId, json.realm, json.assigneeIdMr, json.assigneeIdTissue,
      json.createdOncHistory, json.reviewedOncHistory, json.crSent, json.crReceived, json.notes, json.minimalMr, json.abstractionReady,
      json.mrNeedsAttention, json.tissueNeedsAttention, json.exitDate, additionalValuesJson );
  }
}
