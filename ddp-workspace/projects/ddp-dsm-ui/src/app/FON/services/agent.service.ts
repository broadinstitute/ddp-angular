import {Injectable} from "@angular/core";
import {DSMService} from "../../services/dsm.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {patientListModel} from "../pages/participantsList/models/participantList.model";

@Injectable()

export class AgentService {

  participants$: Observable<any>;


  constructor(private dsmService: DSMService) {
    this.participants$ = dsmService.applyFilter(null,'fon','participantList');
  }

  getParticipants(): Observable<patientListModel[]> {
    return this.participants$.pipe(map(data => this.collectParticipantData(data.participants)));
  }

  getActivityInstances(guid: string) {
    return this.participants$.pipe(map(data => this.collectActivityGuids(data.participants, guid)));
  }

  private collectActivityGuids(particinapts: any[], guid: string) {
    return particinapts.find(pt => pt.esData.profile.guid === guid).esData.activities.map(pt => {
      return {
        name: pt.activityCode,
        guid: pt.guid
      }
    })
  }

  private collectParticipantData(particinapts: any[]): patientListModel[] {
    return particinapts.map(pt => {
      return {
        ID: pt.esData.profile.hruid,
        guid: pt.esData.profile.guid,
        firstName: pt.esData.profile.firstName,
        lastName: pt.esData.profile.lastName,
        birthdate: '01/01/2022',
        registered: '02/02/2002',
        lastUpdated: '01/01/2022',
      }
    })
  }


}
