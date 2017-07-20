import {Component, OnInit, Input} from '@angular/core';
import {OperatorService, Participant} from "../operator/operator.service";
import {UmbrellaConfig} from "../umbrella-config/umbrella-config";

@Component({
  selector: 'foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css']
})
export class FooComponent implements OnInit {

  @Input()
  umbrellaConfig:UmbrellaConfig;

  private participants: Participant[];

  constructor(private operatorService:OperatorService) { }

  // needs a service interface to get your token (which should have your operator id)

  // needs the umbrella name and the API version (another service interface)

  // service interface to read your participants

  // this component visually will show a list of participants and let you choose the active one?

  ngOnInit() {
    console.log('ngoninit');
    this.operatorService.getParticipants("123")
      .finally(() => {
        console.log('fetch participants completed');
      })
      .subscribe(
      participants => {
        this.participants = participants;
        console.log('got ' + this.participants.length + ' participants');
      }
      // error handling taken care of by injected error handler
    )
  }

}
