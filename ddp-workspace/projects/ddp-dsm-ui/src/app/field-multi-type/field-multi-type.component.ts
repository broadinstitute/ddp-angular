import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Value } from '../utils/value.model';

@Component({
  selector: 'app-field-multi-type',
  templateUrl: './field-multi-type.component.html',
  styleUrls: [ './field-multi-type.component.css' ]
})
export class FieldMultiTypeComponent implements OnInit {
  @Input() disabled = false;
  @Input() json: string;
  @Input() values: Value[];
  @Input() multiType: any;
  @Input() fieldName: string;
  @Input() drugs: string[];
  @Input() cancers: string[];
  @Input() patchFinished: boolean;
  @Output() multiTypeChanged = new EventEmitter();

  multiOptions = 'multi_options';
  options = 'options';
  other = 'other';

  _multiType: { [ k: string ]: string | string[] } = {};
  showDelete = false;
  currentPatchField: string;
  _other: { [ k: string ]: string } = {};

  ngOnInit(): void {
    this.setOtherOptionText();
  }

  setOtherOptionText(): void {
    if (this.multiType != null) {
      this.showDelete = true;
      this._multiType = this.multiType;
      if (this.values != null) {
        this.values.forEach(value => {
            if ((value.type === this.multiOptions || value.type2 === this.multiOptions)) {
              const v: any = this.multiType[ value.value ];
              if (typeof v === 'string' && !v.startsWith('[')) {
                // type was changed to multi_select afterwards
                const array: string[] = [];
                array.push(v);
                this._multiType[ value.value ] = array;
                if (array.includes(this.other)) {
                  this._other[ value.value ] = '';
                }
              } else if (v instanceof Array) {
                this._multiType[ value.value ] = v;
                if (v.includes(this.other)) {
                  this._other[ value.value ] = '';
                }
              } else {
                const array: string[] = JSON.parse(v);
                this._multiType[ value.value ] = array;
              }
            } else if ((value.type === this.options || value.type2 === this.options)) {
              this.setOther(value.value);
            }
          }
        );
      }
    } else {
      if (this.values != null) {
        if (this.json != null) {
          this._multiType = JSON.parse(this.json);
        }
        this.values.forEach(value => {
          if (value.type === this.multiOptions || value.type2 === this.multiOptions) {
            if (this.json != null) {
              const o: any = JSON.parse(this.json);
              this._multiType[ value.value ] = o[ value.value ];
              if (this._multiType[ value.value ] != null && this._multiType[ value.value ].includes(this.other)) {
                this._other[ value.value ] = '';
                if (this._multiType[ this.other ] != null) {
                  this._other[ value.value ] = String(this._multiType[ this.other ]);
                }
              }
            } else {
              const array: string[] = [];
              this._multiType[ value.value ] = array;
            }
          } else if ((value.type === this.options || value.type2 === this.options)) {
            this.setOther(value.value);
          }
        });
      }
    }
  }

  setOther(value: string): void {
    if (this._multiType[ value ] === this.other && this._multiType[ this.other ] != null
      && this._multiType[ this.other ] [ value ] != null
    ) {
      this._other[ value ] = this._multiType[ this.other ] [ value ];
    } else {
      this._other[ value ] = null;
    }
  }

  multiTypeValueChanged(value: any, multiType: {}, displayName: string, val: Value): void {
    this.patchFinished = false;
    let v;
    if (typeof value === 'string') {
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (value.source.value != null && value.source.selected) {
        v = value.source.value;
      }
    }
    multiType[ displayName ] = v;
    this.currentPatchField = displayName;

    if (displayName === this.other) {
      multiType[ this.other ] = this._other;
      this.currentPatchField = this.other + '_' + displayName;
    } else if (val.type === this.multiOptions || val.type2 === this.multiOptions ||
      val.type === this.options || val.type2 === this.options
    ) {
      if (multiType[ displayName ] === this.other) {
        this._other[ val.value ] = '';
      } else {
        this._other[ val.value ] = null;
      }
      multiType[ this.other ] = this._other;
    }
    this.multiTypeChanged.emit(JSON.stringify(multiType));
  }

  delete(): void {
    this.multiTypeChanged.emit(null);
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  isCheckboxPatchedCurrently(field: string): string {
    if (this.currentPatchField === field) {
      return 'warn';
    }
    return 'primary';
  }

  currentField(field: string): void {
    if (field != null || (field == null && this.patchFinished)) {
      this.currentPatchField = field;
    }
  }
}
