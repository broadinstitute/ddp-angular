export class PhiManifestResponseModel{
    constructor(public data: string[][],public ddpParticipantId: string, public orderId: string,
                public errorMessage: string) {
    }

    static parse(json): PhiManifestResponseModel {
        return new PhiManifestResponseModel(json.data, json.ddpParticipantId, json.orderId, json.errorMessage);
    }
}
