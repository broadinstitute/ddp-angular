import { ActivityData } from '../../activity-data/activity-data.model';
import { Address } from '../../address/address.model';
import { InvitationData } from '../../invitation-data/invitation-data.model';
import { Computed } from './computed.model';
import { MedicalProvider } from './medical-providers.model';
import { QuestionAnswer } from '../../activity-data/models/question-answer.model';

export class Data {
  constructor(public profile: object, public status: string, public statusTimestamp: number,
              public dsm: object, public ddp: string, public medicalProviders: Array<MedicalProvider>,
               public activities: Array<ActivityData>, public address: Address, public invitations: Array<InvitationData>,
              public computed?: Computed
  ) {
    this.profile = profile;
    this.status = status;
    this.statusTimestamp = statusTimestamp;
    this.dsm = dsm;
    this.ddp = ddp;
    this.medicalProviders = medicalProviders;
    this.activities = activities;
    this.address = address;
    this.invitations = invitations;
    this.computed = computed;
  }

  getMultipleDatesForActivity( activityData: ActivityData, name: string ) {
    let answers: Array<QuestionAnswer> = [];
    for (let x of this.activities) {
      if (x.activityCode === activityData.activityCode) {
        for (let y of x.questionsAnswers) {
          if (y.stableId === name) {
            answers.push(y);
          }
        }
      }
    }
    return answers.reverse();
  }

  static parse(json): Data {
    let jsonData: any[];
    let medicalProviders: Array<MedicalProvider> = null;
    if (json.medicalProviders != null) {
      jsonData = json.medicalProviders;
      if (json != null && jsonData != null) {
        medicalProviders = [];
        jsonData.forEach((val) => {
          const medicalProvider = MedicalProvider.parse(val);
          medicalProviders.push(medicalProvider);
        });
      }
    }
    return new Data(
      json.profile, json.status, json.statusTimestamp, json.dsm,
      json.ddp, medicalProviders, json.activities, json.address, json.invitations, json.computed
    );
  }

  getActivityDataByCode(code: string): any {
    return this.activities.find(x => x.activityCode === code);
  }

  getMultipleAnswersForPickList(activityData: ActivityData, name: string): string[] {
    const answers: Array<string> = [];
    for (const x of this.activities) {
      if (x.activityCode === activityData.activityCode) {
        for (const y of x.questionsAnswers) {
          if (y.stableId === name) {
            for (const answer of y.answer) {
              answers.push(answer);
            }
          }
        }
      }
    }
    return answers.reverse();
  }
}
