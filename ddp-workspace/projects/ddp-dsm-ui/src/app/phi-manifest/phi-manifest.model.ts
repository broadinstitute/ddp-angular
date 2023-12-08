export class PhiManifestModel{
    constructor(public data: string[][],public ddpParticipantId:string, public orderNumber:string,
                public errorMessage: string) {
    }

    static parse(json): PhiManifestModel {
        return new PhiManifestModel(json.data, json.ddpParticipantId, json.orderNumber, json.errorMessage);
    }
}
