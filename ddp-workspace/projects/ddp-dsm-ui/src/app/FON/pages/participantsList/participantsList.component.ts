import {Component, OnInit} from "@angular/core";
import {map, tap} from "rxjs/operators";
import {DSMService} from "../../../services/dsm.service";
import {patientListModel} from "./models/participantList.model";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AgentService} from "../../services/agent.service";

@Component({
  selector: 'app-participantsLit',
  templateUrl: './participantsList.component.html',
  styleUrls: ['./participantsList.component.css']
})

export class ParticipantsListComponent implements OnInit {

  patients$: Observable<patientListModel[]>;

  constructor(private agent: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.patients$ = this.agent.getParticipants();
  }


  openActivities(id: string) {
    this.router.navigate(['../patient', id], {relativeTo: this.activatedRoute})
  }

}
