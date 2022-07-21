import { ActivityData } from '../../activity-data/activity-data.model';
import { Address } from '../../address/address.model';
import { InvitationData } from '../../invitation-data/invitation-data.model';
import { Computed } from './computed.model';
import { MedicalProvider } from './medical-providers.model';
import { QuestionAnswer } from '../../activity-data/models/question-answer.model';
import {File} from './file.model';


export class Data {
  constructor(public profile: object, public status: string, public statusTimestamp: number,
              public dsm: object, public ddp: string, public medicalProviders: Array<MedicalProvider>,
               public activities: Array<ActivityData>, public address: Address, public invitations: Array<InvitationData>,
              public computed?: Computed, public files?: Array<File>
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
    this.files = files
  }

  getMultipleDatesForActivity( activityData: ActivityData, name: string ): QuestionAnswer[] {
    const answers: Array<QuestionAnswer> = [];
    for (const x of this.activities) {
      if (x.activityCode === activityData.activityCode) {
        for (const y of x.questionsAnswers) {
          if (y.stableId === name) {
            answers.push( y );
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
      if (jsonData != null) {
        medicalProviders = [];
        jsonData.forEach((val) => {
          const medicalProvider = MedicalProvider.parse(val);
          medicalProviders.push(medicalProvider);
        });
      }
    }
    return new Data(
      json.profile, json.status, json.statusTimestamp, json.dsm,
      json.ddp, medicalProviders, this.activities( json.activities ), json.address, json.invitations, json.computed, json.files
    );
  }

  private static activities(acts: ActivityData[]): ActivityData[] {
    return acts?.map(act => ActivityData.parse(act));
  }

  public getGroupedOptionsForAnswer( questionAnswer: QuestionAnswer): string[]  {
      const answers: Array<string> = [];
      for (const answer of questionAnswer.answer) {
        if (questionAnswer.groupedOptions) {
          const ans = questionAnswer.groupedOptions[ answer ];
          if (ans) {
            for (const a of ans) {
              answers.push( a );
          }
        }
      }
    }
    return answers.reverse();
  }


  getActivityDataByCode(code: string): any {
    return this.activities.filter(x => x.activityCode === code);
  }

  getMultipleAnswersForPickList(activityData: ActivityData, name: string): QuestionAnswer[] {
    const answers: Array<QuestionAnswer> = [];
    for (const x of this.activities) {
      if (x.activityCode === activityData.activityCode) {
        for (const questionAnswer of x.questionsAnswers) {
          if (questionAnswer.stableId === name) {
            answers.push( questionAnswer );
          }
        }
      }
    }
    return answers.reverse();
  }
}
