export interface ParticipantDataModel {
  participantId: string;
  ddpParticipantId: string;
  realm: string;
  assigneeIdMr: string;
  assigneeIdTissue: string;
  created: string;
  reviewed: string;
  crSent: string;
  crReceived: string;
  notes: string;
  minimalMr: boolean;
  abstractionReady: boolean;
  mrNeedsAttention: boolean;
  tissueNeedsAttention: boolean;
  exitDate: number;
  additionalValuesJson: object;
}
