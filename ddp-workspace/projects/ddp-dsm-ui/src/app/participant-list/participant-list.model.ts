import { AbstractionGroup } from '../abstraction-group/abstraction-group.model';
import {ActivityDefinition} from '../activity-data/models/activity-definition.model';
import { Abstraction } from '../medical-record-abstraction/model/medical-record-abstraction.model';
import { MedicalRecord } from '../medical-record/medical-record.model';
import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import {Utils} from '../utils/utils';
import { ParticipantData } from './models/participant-data.model';
import { Sample } from './models/sample.model';
import { Data } from './models/data.model';
import { ParticipantDSMInformation } from './models/participant.model';

export class Participant {
  constructor(public data: Data, public participant: ParticipantDSMInformation, public medicalRecords: Array<MedicalRecord>,
               public kits: Array<Sample>, public oncHistoryDetails: Array<OncHistoryDetail>,
               public abstractionActivities: Array<Abstraction>,
               public abstractionSummary: Array<AbstractionGroup>, public participantData: Array<ParticipantData>,
               public abstraction?: Abstraction, public review?: Abstraction, public qc?: Abstraction, public finalA?: Abstraction,
               public proxyData?: Array<Data>) {
    this.data = data;
    this.participant = participant;
    this.medicalRecords = medicalRecords;
    this.kits = kits;
    this.oncHistoryDetails = oncHistoryDetails;
    this.abstractionActivities = abstractionActivities;
    this.abstractionSummary = abstractionSummary;
    this.participantData = participantData;
    this.abstraction = abstraction;
    this.review = review;
    this.qc = qc;
    this.finalA = finalA;
    this.proxyData = proxyData;
  }

  isSelected = false;

  static parse(json): Participant {
    let jsonData: any[];
    const medicalRecords: Array<MedicalRecord> = [];
    jsonData = json.medicalRecords;
    const medicalProviders: any[] = json?.esData?.medicalProviders;
    if (jsonData != null) {
      jsonData.forEach((val, index) => {
        const medicalRecord = MedicalRecord.parse(val, medicalProviders && medicalProviders[index]);
        medicalRecords.push(medicalRecord);
      });
    }

    const oncHistoryDetails: Array<OncHistoryDetail> = [];
    jsonData = json.oncHistoryDetails;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const oncHistory = OncHistoryDetail.parse(val);
        oncHistoryDetails.push(oncHistory);
      });
    }

    const samples: Array<Sample> = [];
    jsonData = json.kits;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const sample = Sample.parse(val);
        samples.push(sample);
      });
    }

    const abstractionSummary: Array<AbstractionGroup> = [];
    jsonData = json.abstractionSummary;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const abstractionGroup = AbstractionGroup.parse(val);
        abstractionSummary.push(abstractionGroup);
      });
    }

    let esData: Data = null;
    if (json.esData != null) {
      esData = Data.parse(json.esData);
    }

    const proxyData: Array<Data> = [];
    jsonData = json.proxyData;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const proxy = Data.parse(val);
        proxyData.push(proxy);
      });
    }

    const abstraction: Abstraction = new Abstraction(null, null, null, 'abstraction', 'not_started', null, null, null);
    const review: Abstraction = new Abstraction(null, null, null, 'review', 'not_started', null, null, null);
    const qc: Abstraction = new Abstraction(null, null, null, 'qc', 'not_started', null, null, null);
    const finalA: Abstraction = new Abstraction(null, null, null, 'final', 'not_started', null, null, null);

    let participant: ParticipantDSMInformation = null;
    jsonData = json.participant;
    if (jsonData != null) {
      participant = ParticipantDSMInformation.parse(jsonData);
    }

    const participantData: Array<ParticipantData> = [];
    jsonData = json.participantData;
    if (jsonData != null) {
      jsonData.forEach((val) => {
        const data = ParticipantData.parse(val);
        participantData.push(data);
      });
    }

    return new Participant(
      esData, participant, medicalRecords, samples, oncHistoryDetails, json.abstractionActivities,
      abstractionSummary, participantData, abstraction, review, qc, finalA, proxyData
    );
  }

  public getActivitiesSorted(activityDefinitionList: ActivityDefinition[]): any[]{
    return this.data.activities.sort((ac1, ac2)=>{
      const acDef1 = Utils.getActivityDefinition(activityDefinitionList, ac1.activityCode, ac1.activityVersion);
      const acDef2 = Utils.getActivityDefinition(activityDefinitionList, ac2.activityCode, ac2.activityVersion);
      return acDef1.displayOrder - acDef2.displayOrder;
    });
  }

  getSampleStatus(): string {
    let status = '';
    if (this.kits != null && this.kits.length > 0) {
      for (const sample of this.kits) {
        status += sample.kitTypeName + ': ' + sample[ 'sampleQueue' ] + '\n';
      }
    }
    return status;
  }

  getProcessStatus(): string {
    if (this.abstraction.aStatus === 'not_started') {
      return 'Not Started';
    } else if (this.abstraction.aStatus === 'in_progress' || this.abstraction.aStatus === 'clear'
      || this.review.aStatus === 'in_progress' || this.review.aStatus === 'clear') {
      return 'In Progress';
    } else if (this.qc.aStatus === 'in_progress') {
      return 'QC in progress';
    } else if (this.abstraction.aStatus === 'done' && this.review.aStatus === 'done' && this.qc.aStatus !== 'done') {
      return 'v';
    } else if (this.qc.aStatus === 'done') {
      return 'Finished';
    }
    return '';
  }

  getAbstractionStatus(): string {
    let status = '';
    if (this.abstraction.aStatus === 'not_started') {
      status += 'First Abstraction not started\n';
    } else if (this.abstraction.aStatus === 'in_progress') {
      status += 'First Abstraction started\n';
    } else if (this.abstraction.aStatus === 'done') {
      status += 'First Abstraction finished\n';
    } else if (this.abstraction.aStatus === 'clear') {
      status += 'First Abstraction not finished\n';
    }
    if (this.review.aStatus === 'not_started') {
      status += 'Second Abstraction not started\n';
    }
    if (this.review.aStatus === 'in_progress') {
      status += 'Second Abstraction started\n';
    } else if (this.review.aStatus === 'clear') {
      status += 'Second Abstraction not finished\n';
    } else if (this.review.aStatus === 'done') {
      status += 'Second Abstraction finished\n';
    }
    return status;
  }

  getQCStatus(): string {
    let status = '';
    if (this.qc.aStatus === 'not_started') {
      status += 'QC not started\n';
    } else if (this.qc.aStatus === 'in_progress') {
      status += 'QC started\n';
    } else if (this.qc.aStatus === 'done') {
      status += 'QC finished\n';
    }
    return status;
  }
}
