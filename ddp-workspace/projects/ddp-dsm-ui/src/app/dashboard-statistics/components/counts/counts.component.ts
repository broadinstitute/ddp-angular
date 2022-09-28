import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-counts',
  templateUrl: `counts.component.html`,
  styleUrls: ['counts.component.scss']
})

export class CountsComponent {
  @Input() countsData: any;
}
