import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {AgentService} from "../../services/agent.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})

export class ActivitiesComponent implements OnInit {
  activityGuides: Observable<any>

    constructor(private agent: AgentService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.activityGuides = this.agent.getActivityInstances(params.guid)
    })
    }


  navigate($event: any): void {
      console.log('navigate');
    }
}
