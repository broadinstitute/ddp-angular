import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {SessionMementoService} from "ddp-sdk";
import {ComponentService} from "../../../../services/component.service";

@Component({
  selector: 'app-activity',
  template: `
    <ddp-activity-redesigned [studyGuid]="'fon'"
                             [activityGuid]="activityGuid"
                             (submit)="navigate($event)"
                             (activityCode)="activityCodeChanged($event)"
    >
    </ddp-activity-redesigned>
  `,
  styles: [``]
})

export class ActivityComponent implements OnInit {
  activityGuid: string;
  selectedRealm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);

  constructor(private router: ActivatedRoute, private sessionService: SessionMementoService) {
  }

  ngOnInit() {

    this.router.params.subscribe((param: Params) => {
      this.activityGuid = param.activity;
    })

    this.router.parent.params.subscribe((param: Params) => {
      this.sessionService.setParticipant(param.guid)
    })

  }

  navigate(event: any) {
    console.log(event)
  }

  activityCodeChanged(code: string): void {
    console.log('activityCodeChanged', code);
  }
}
