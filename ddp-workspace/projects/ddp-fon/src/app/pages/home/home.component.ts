import { Component } from '@angular/core';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  Route = Route;
  readonly BROAD_URL = 'https://www.broadinstitute.org';
  readonly MGH_URL = 'https://www.massgeneral.org';
  readonly SADS_URL = 'https://www.sads.org';
  readonly VUMC_URL = 'https://medicine.vumc.org';
  readonly UWM_URL = 'https://www.medicine.wisc.edu';
  readonly STANFORD_URL = 'https://stanfordhealthcare.org/medical-clinics/center-inherited-cardiovascular-disease.html';
}
