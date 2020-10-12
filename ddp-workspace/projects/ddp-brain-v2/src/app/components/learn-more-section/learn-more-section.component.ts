import { Component } from '@angular/core';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-learn-more-section',
  templateUrl: './learn-more-section.component.html',
  styleUrls: ['./learn-more-section.component.scss']
})
export class LearnMoreSectionComponent {
  public appRoutes = AppRoutes;
}
