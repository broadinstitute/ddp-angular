import { Component, Input, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Filter } from './filter-column.model';

@Component({
  selector: 'app-filter-column',
  templateUrl: './filter-column.component.html',
  styleUrls: [ './filter-column.component.css' ]
})
export class FilterColumnComponent implements OnInit {
  @Input() dataFilter: Filter;
  @Input() editable = true;

  showOptions = false;
  selected: number;

  ngOnInit(): void {
    if (this.dataFilter.singleOption) {
      for (const [ key, value ] of Object.entries(this.dataFilter.selectedOptions)) {
        if (value) {
          this.selected = Number(key);
          break;
        }
      }
    }
  }

  dateChange(value: any, num: number): void {
    let v;
    if (typeof value === 'string') {
      this.dataFilter[ 'value' + num ] = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
        this.dataFilter[ 'value' + num ] = v;
      }
    }
  }

  changeValue(value, dataFilter: Filter): void {
    if (value.checked) {
      dataFilter.value1 = true;
      dataFilter.value2 = false;
    } else {
      dataFilter.value1 = false;
    }
  }

  changeValue2(value, dataFilter: Filter): void {
    if (value.checked) {
      dataFilter.value1 = false;
      dataFilter.value2 = true;
    } else {
      dataFilter.value2 = false;
    }
  }

  hasSelectedOption(dataFilter: Filter): boolean {
    if (dataFilter.type !== Filter.OPTION_TYPE) {
      return false;
    }
    for (const o of dataFilter.selectedOptions) {
      if (o) {
        return true;
      }
    }
    return false;
  }

  radioChange(event: MatRadioChange): void {
    // deselect all values
    for (const i in this.dataFilter.selectedOptions) {
      if (this.dataFilter.selectedOptions[ i ]) {
        this.dataFilter.selectedOptions[ i ] = false;
      }
    }

    // set value to selected
    this.dataFilter.selectedOptions[ event.value ] = true;
  }

  isDynamicField(dataFilter: Filter): boolean {
    return dataFilter?.participantColumn?.tableAlias === 'participantData';
  }

  inputValueChanged(): void {
    this.dataFilter.notEmpty = false;
    this.dataFilter.empty = false;
  }
}
