import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import {ParticipantDSMInformation} from '../participant-list/models/participant.model';
import { Tissue } from '../tissue/tissue.model';

export class TissueList {
  constructor(
    public oncHistoryDetails: OncHistoryDetail,
    public tissue: Tissue,
    public ddpParticipantId: string,
    public participantId: string,
    public participant: ParticipantDSMInformation
  ) {}

  static parse(json): TissueList {
    const oncHistory: OncHistoryDetail = OncHistoryDetail.parse(json.oncHistoryDetails);
    let tissue: Tissue;
    if (json.tissue != null) {
      tissue = Tissue.parse(json.tissue);
    }
    const participant = ParticipantDSMInformation.parse(json.participant);
    return new TissueList(oncHistory, tissue, json.ddpParticipantId, json.participantId, participant);
  }
}
