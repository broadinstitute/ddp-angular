import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SearchPatientDataModel } from '../../models/search-patient-data.model';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPanelComponent {
  @Output() searchEmitter = new EventEmitter<SearchPatientDataModel>();

  readonly searchGroup: FormGroup = this.formBuilder.group({
    fonId: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    email: new FormControl(null),
    birthDate: new FormControl(null)
  });

  constructor(private formBuilder: FormBuilder) {
  }

  onSearch(): void {
    this.searchEmitter.emit(this.searchGroup.value);
  }

  onClear(): void {
    this.searchGroup.reset();
  }
}
