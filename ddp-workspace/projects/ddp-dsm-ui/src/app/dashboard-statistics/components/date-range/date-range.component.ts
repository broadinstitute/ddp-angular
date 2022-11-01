import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss']
})
export class DateRangeComponent {
  range = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
}
