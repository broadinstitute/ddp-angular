import { Component } from '@angular/core';
import { PexService } from './components/pex/pex.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'study-builder-ui';
  constructor(public pexService: PexService) {

      this.pexService.mapPEXModeltoString();

  }
}
