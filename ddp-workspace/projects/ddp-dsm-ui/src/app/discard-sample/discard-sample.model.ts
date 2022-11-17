export class DiscardSample {

  constructor(
    public realm: string, public ddpParticipantId: string, public bspCollaboratorParticipantId: string,
    public kitRequestId: string, public kitDiscardId: string, public user: string,
    public exitDate: number, public kitType: string, public scanDate: number, public receivedDate: number,
    public kitLabel: string, public pathBSPScreenshot: string, public pathSampleImage: string,
    public note: string, public userConfirm: string, public discardUser: string, public discardDate: string,
    public action: string
  ) {

  }

  static parse(json): DiscardSample {
    return new DiscardSample(json.realm, json.ddpParticipantId, json.bspCollaboratorParticipantId, json.kitRequestId, json.kitDiscardId,
      json.user, json.exitDate, json.kitType, json.scanDate, json.receivedDate,
      json.kitLabel, json.pathBSPScreenshot, json.pathSampleImage, json.note, json.userConfirm,
      json.discardUser, json.discardDate, json.action);
  }

  public getID(): any {
    if (this.bspCollaboratorParticipantId != null && this.bspCollaboratorParticipantId !== '') {
      const idSplit: string[] = this.bspCollaboratorParticipantId.split('_');
      if (idSplit.length === 2) {
        return idSplit[1];
      }
      if (idSplit.length > 2) { // RGP
        return this.bspCollaboratorParticipantId.slice(this.bspCollaboratorParticipantId.indexOf('_') + 1);
      }
    }
    return '';
  }

  isSetToDiscard(): boolean {
    return this.action != null && this.action !== 'hold' && this.action !== 'done';
  }

  isActionStillChangeable(): boolean {
    return this.action != null && (this.action === 'discard' || this.action === 'hold');
  }

  getAction(): string {
    if (this.action != null) {
      if (this.action === 'hold') {
        return 'Hold';
      }
      if (this.action === 'discard') {
        if (this.pathBSPScreenshot != null && this.pathSampleImage != null) {
          return 'To be Reviewed';
        }
        return 'Discard';
      }
      if (this.action === 'toReview') {
        if (this.userConfirm != null) {
          return 'To be Destroyed';
        }
        return 'To be Reviewed';
      }
      if (this.action === 'toDestroy') {
        return 'To be Destroyed';
      }
      if (this.action === 'done') {
        return 'Destroyed';
      }
    }
    return '';
  }
}
