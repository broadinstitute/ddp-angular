import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {testData} from "../../testData";
import {AdministrationUser} from "../../interfaces/administrationUser";

@Component({
  selector: 'app-list-users',
  templateUrl: 'listAdministrationUsers.component.html',
  styleUrls: ['listAdministrationUsers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAdministrationUsersComponent {
  @Input() usersList: AdministrationUser[] = testData;

  public trackBy(index: number, {name, phone, email}: AdministrationUser): any {
    return name || phone || email;
  }

}
