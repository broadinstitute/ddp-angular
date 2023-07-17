import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AdministrationUserRole} from "../../interfaces/AdministrationUserRole";

@Component({
  selector: 'app-permission-checkbox',
  templateUrl: 'permissionCheckbox.component.html',
  styleUrls: ['permissionCheckbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionCheckboxComponent implements OnInit {
  @Input() role: AdministrationUserRole;
  @Input() onlyCheckbox: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() checkboxChanged = new EventEmitter<AdministrationUserRole>();

  public idRandomizer: string;

  ngOnInit(): void {
    this.idRandomizer = this.role.roleGuid + Math.floor(Math.random() * 100000);
  }

  public onChange(changeEvent: Event, role: AdministrationUserRole): void {
    const {checked} = changeEvent.target as HTMLInputElement;
    this.checkboxChanged.next({...role, isSelected: checked});
  }
}
