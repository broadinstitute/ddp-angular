import { Component } from '@angular/core';
import { Route } from '../../../constants/route';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  Route = Route;
  readonly ADDITIONAL_VENTURES_URL = 'https://www.additionalventures.org';
  readonly BROAD_INSTITUTE_URL = 'https://www.broadinstitute.org';
  readonly BOSTON_HOSPITAL_URL = 'https://www.childrenshospital.org';
  readonly GENOME_MEDICAL_URL = 'https://www.genomemedical.com';
}
