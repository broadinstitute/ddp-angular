import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Role} from '../../interfaces/role';

@Component({
  selector: 'app-permission-checkbox',
  templateUrl: 'permissionCheckbox.component.html',
  styleUrls: ['permissionCheckbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionCheckboxComponent implements OnInit {
  @Input() role: Role;
  @Input() onlyCheckbox = false;
  @Input() isDisabled = false;

  @Output() checkboxChanged = new EventEmitter<Role>();

  public idRandomizer: string;

  ngOnInit(): void {
    this.idRandomizer =
      (this.role?.name || 'defaultGuid1994') +
      Math.floor(Math.random() * 100000);
  }

  public onChange(changeEvent: Event, role: Role): void {
    const {checked} = changeEvent.target as HTMLInputElement;
    this.checkboxChanged.next({...role, hasRole: checked});
  }
}
