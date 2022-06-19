import { Component } from '@angular/core';
import {
  RegisterPatientsModalComponent
} from "../../components/register-patients-modal/register-patients-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Modal section
  registerPatientsModalComponent = RegisterPatientsModalComponent;
}
